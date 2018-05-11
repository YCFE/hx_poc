'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKylinVersion = getKylinVersion;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* getKylinVersion(cwd) {

  // 从当前cwd 的 node_modules 里面
  const files = [_glob2.default.sync(_path2.default.resolve(cwd, './node_modules/@ali/kylin-**/package.json')), _glob2.default.sync(_path2.default.resolve(cwd, './node_modules/@ali/vue-component-**/package.json')), _glob2.default.sync(_path2.default.resolve(cwd, './node_modules/@alipay/antui**/package.json')), _glob2.default.sync(_path2.default.resolve(cwd, './node_modules/vue**/package.json'))].reduce((a, b) => a.concat(b), []);

  const taskArr = files.map(p => _fs2.default.readFile(p, 'utf8'));
  const taskRet = yield taskArr;

  const jsonList = taskRet.map(d => {
    try {
      return JSON.parse(d);
    } catch (ex) {
      console.error(ex);
    }
  });

  return jsonList.map(j => ({
    name: j.name,
    version: j.version
  }));
}