'use strict';

var assert = require('assert');
var instanceStats = require('./');

function testObserverInterval(interval, duration, errorRange, done) {
  const observer = new instanceStats.StatsObserver(interval);
  let cnt = 0
  observer.on('cpu', function () {
    cnt += 1;
  });

  observer.start();
  setTimeout(function () {
    observer.stop();
    const error = Math.abs(cnt - duration / interval)
    const msg = 'Expect {error} tobe less than {errorRange}.'
                    .replace('{error}', error)
                    .replace('{errorRange}', errorRange);
    assert( error <= errorRange, msg);
    done();
  }, duration);
}

describe('Test StatsObserver', function() {
  it('test Observer interval 1', function(done) {
    testObserverInterval(100, 500, 2, done);
  });

  it('test Observer interval 2', function(done) {
    testObserverInterval(200, 500, 1, done);
  });

  it('test Observer interval 3', function(done) {
    testObserverInterval(50, 500, 2, done);
  });

  it('test broadcast', function (done) {
    const observer = new instanceStats.StatsObserver(10);
    observer.on('cpu', function () {
      done();
    });

    observer.start();
  })
});