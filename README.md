# instance-stats

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

## Installation

```
  npm install --save instance-stats
```

## Usage

### Basics

```js
const instanceStats = require('instance-stats');

// Get cpu info
let cpus = instanceStats.getCpuInfo();
console.log(cpus);

// Get gpu info. getGpusInfo function return a promise
instanceStats.getGpusInfo()
  .then(function(gpus, stderr) {
    console.log(gpus);
  })
  .catch(function(error) {
    console.log(error);
  })
```

### Usage observer

This library also provide Observer object for getting CPU and GPU usage.

```js
const instanceStats = require('instance-stats');

// Create an observer object which broadcasts infomation every second (1000ms)
const observer = new instanceStats.StatsObserver(1000);

// Listen on CPU event
observer.on('cpu', function(cpuInfo, timestamp) {
  // Do something...
});

// Listen on GPU event
observer.on('gpu', function(cpuInfo, timestamp) {
  // Do something...
});

// Listen on GPU error event
observer.on('gpu-error', function(error) {
  // Do something...
});

// Start the observer
observer.start();

// Stop the observer after 5 seconds (5000ms)
setTimeout(function () {
  observer.stop();
}, 5000);
```

## Getting To Know Yeoman

Yeoman has a heart of gold. He&#39;s a person with feelings and opinions, but he&#39;s very easy to work with. If you think he&#39;s too opinionated, he can be easily convinced. Feel free to [learn more about him](http://yeoman.io/).

## Created with
[Yeoman](https://npmjs.org/package/yo) and [Generator-simple-package](https://npmjs.org/package/generator-simple-package)

## License
MIT © [nghiattran]()

[npm-image]: https://badge.fury.io/js/instance-stats.svg
[npm-url]: https://npmjs.org/package/instance-stats
[travis-image]: https://travis-ci.org/nghiattran/instance-stats.svg?branch=master
[travis-url]: https://travis-ci.org/nghiattran/instance-stats
[daviddm-image]: https://david-dm.org/nghiattran/instance-stats.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/nghiattran/instance-stats
[coveralls-image]: https://coveralls.io/repos/nghiattran/instance-stats/badge.svg
[coveralls-url]: https://coveralls.io/github/nghiattran/instance-stats
