// 用来做具体调用上报
import { readyCall } from './bridge';

const seedIdPrefix = 'H5_KYLIN_PERFORMANCE_';

export function performanceRemoteLog(seedId, param1 = {}, param2 = {}) {
  return logReport(`${seedIdPrefix}${seedId}`, param1, param2);
}

export function getRandom() {
  const time = (new Date()).getTime();
  const random = Math.random().toString(16).slice(2);
  return `${time}_${random}`;
}

function logReport(seedId, param1 = {}, param2 = {}) {
  const remoteConfig = {
    seedId: seedId,
    param1: objToStr(param1, '^'),
    param2: objToStr(param2, '^')
  };

  return readyCall('remoteLog', remoteConfig);
}

function objToStr(obj, sep = '^') {
  let strArr = [];

  try {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        strArr.push(prop + '=' + obj[prop]);
      }
    }
  } catch (ex) {
    return '';
  }

  return strArr.join(sep);
}
