'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// 收集指标
// appid, 来自 hpmfile
// 执行目录
// 当前package.json中依赖kylin相关的所有版本号，
// 不要关心构建产物
// 目前不关心构建结果
// 后续再加

exports.default = function* (program, success) {
  let detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


  try {
    const appId = yield (0, _appid.getAppId)(program.cwd);
    const info = yield (0, _appid.getInfo)(program.cwd);

    const versions = yield (0, _kylin.getKylinVersion)(program.cwd);

    // 上报
    const ret = yield _urllib2.default.request('http://h5doc.dockerlab.alipay.net/api/log/common', {
      method: 'GET',
      data: {
        mode: 'kylin-build',
        url: program.cwd,
        ext_info1: JSON.stringify(_extends({
          appId: appId,
          versions: versions,
          success: success,
          info: info
        }, detail))
      }
    });
  } catch (ex) {}
};

var _urllib = require('urllib');

var _urllib2 = _interopRequireDefault(_urllib);

var _appid = require('./appid');

var _kylin = require('./kylin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];