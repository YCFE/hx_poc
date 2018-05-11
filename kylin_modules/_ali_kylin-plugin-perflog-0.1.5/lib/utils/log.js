'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performanceRemoteLog = performanceRemoteLog;
exports.getRandom = getRandom;

var _bridge = require('./bridge');

var seedIdPrefix = 'H5_KYLIN_PERFORMANCE_';

function performanceRemoteLog(seedId) {
  var param1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var param2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return logReport('' + seedIdPrefix + seedId, param1, param2);
}

function getRandom() {
  var time = new Date().getTime();
  var random = Math.random().toString(16).slice(2);
  return time + '_' + random;
}

function logReport(seedId) {
  var param1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var param2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var remoteConfig = {
    seedId: seedId,
    param1: objToStr(param1, '^'),
    param2: objToStr(param2, '^')
  };

  return (0, _bridge.readyCall)('remoteLog', remoteConfig);
}

function objToStr(obj) {
  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '^';

  var strArr = [];

  try {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        strArr.push(prop + '=' + obj[prop]);
      }
    }
  } catch (ex) {
    return '';
  }

  return strArr.join(sep);
}
//# sourceMappingURL=log.js.map