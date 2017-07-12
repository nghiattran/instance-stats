'use strict';

const os = require('os');
const exec = require('child_process').exec;
const EventEmitter = require('events');

const defaultGpuQuery = {
  index: 'index',
  uuid: 'uuid',
  name: 'name',
  'temperature.gpu': 'temperature',
  'utilization.gpu': 'utilization',
  'memory.used': 'usedMemory',
  'memory.total': 'totalMemory'
};

/**
 * Get cpu info.
 * @return {Object} Cou info
 */
function getCpusInfo() {
  let cpus = os.cpus();
  for (let i = 0; i < cpus.length; i++) {
    let times = cpus[i].times;
    cpus[i].total = times.user + times.nice + times.sys + times.irq + times.idle;
  }
  return cpus;
}

/**
 * Get gpu info
 * @param  {Object} queryFields Fields to be queried. Keys of object are the query field and values are corresponding renamed key in returned object.
 * @return {Object}             Gpu info
 */
function getGpusInfo(queryFields=defaultGpuQuery) {
  const keys = Object.keys(queryFields);
  let fields = keys.join(',');
  const query = `nvidia-smi --query-gpu=${fields} --format=csv,noheader,nounits`;

  return new Promise((resolve, reject) => {
    exec(query, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      let gpuInfoArr = stdout.split(', ');
      let gpuInfo = {};

      for (let i = 0; i < keys.length; i++) {
        gpuInfo[queryFields[keys[i]]] = gpuInfoArr[i];
      }

      resolve(gpuInfo, stderr);
    });
  })
}

/**
 * Observer class for watching cpu and gpu usage.
 */
class StatsObserver extends EventEmitter {
  /**
   * Constructor
   * @param  {int} interval time interval for observer.
   */
  constructor(interval) {
    super();

    this.interval = interval;
    this.isRunning = false;
  }

  /**
   * Set parameter for getGpusInfo function
   * @param {[type]} query [description]
   */
  setGpuQuery(query=defaultGpuQuery) {
    this.gpuQuery = query;
  }

  /**
   * Get statistic and broadcast those data to listeners.
   */
  broadcast() {
    let self = this;
    const cpuInfo = getCpusInfo();

    self.emit('cpu', cpuInfo, Date.now());
    getGpusInfo(this.gpuQuery)
      .then(function (gpuInfo, stderr) {
        const timestamp = Date.now();
        self.emit('gpu', gpuInfo, timestamp);
        self.emit('cpu-gpu', {cpuInfo, gpuInfo}, timestamp);
      })
      .catch(function (error) {
        const timestamp = Date.now();
        self.emit('gpu-error', error, timestamp);
        self.emit('cpu-gpu-error', {cpuInfo, gpuError:error}, timestamp);
      })
  }

  /**
   * Keep broadcasting in an loop controlled by isRunning.
   */
  broadcastLoop() {
    let self = this;
    setTimeout(function () {
      if (self.isRunning) {
        self.broadcast();
        self.broadcastLoop();
      }
    }, this.interval);
  }

  /**
   * Start observing.
   */
  start() {
    this.isRunning = true;
    this.broadcastLoop();
  }

  /**
   * Strop observing.
   */
  stop() {
    this.isRunning = false;
  }
}

module.exports = {
  getGpusInfo, getCpusInfo, StatsObserver
}