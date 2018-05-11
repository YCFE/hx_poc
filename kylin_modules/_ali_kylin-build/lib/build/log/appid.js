'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInfo = getInfo;
exports.getAppId = getAppId;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* getInfo(cwd) {

  let pkgInfo = null;

  const pkgPath = _path2.default.resolve(cwd, './package.json');
  const pkgExisted = yield _fs2.default.exists(pkgPath);

  if (pkgExisted) {
    try {
      const pkg = require(pkgPath);
      const kylinApp = pkg.kylinApp || {};

      pkgInfo = {
        name: pkg.name,
        version: pkg.version,
        author: pkg.author,
        pages: kylinApp.pages ? Object.keys(kylinApp.pages) : []
      };
    } catch (ex) {
      console.error(ex);
    }
  }

  return pkgInfo;
}

function* getAppId(cwd) {

  let appid = null;
  const mobileConfigPath = _path2.default.resolve(cwd, './mobile.config.js');
  const hpmConfigPath = _path2.default.resolve(cwd, './hpmfile.json');

  const mobileConfigExisted = yield _fs2.default.exists(mobileConfigPath);
  const hpmConfigExisted = yield _fs2.default.exists(hpmConfigPath);

  if (mobileConfigExisted) {
    try {
      const json = require(mobileConfigPath);
      appid = json.packages.alipay.appid;
    } catch (ex) {
      console.error(ex);
    }
  } else if (hpmConfigExisted) {
    try {
      const json = require(hpmConfigPath);
      appid = json.appid;
    } catch (ex) {
      console.error(ex);
    }
  }

  return appid;
}