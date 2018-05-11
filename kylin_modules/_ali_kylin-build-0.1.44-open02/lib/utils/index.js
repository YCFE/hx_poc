'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hint = hint;
exports.copyAndReplace = copyAndReplace;
exports.exec = exec;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hint() {
  let tips = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  console.log(`${_chalk2.default.cyan(tips)} ${str}`);
}

hint.success = function () {
  let tips = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  console.log(`${_chalk2.default.green(tips)} ${str}`);
};

hint.error = function () {
  let tips = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  console.log(`${_chalk2.default.red(tips)} ${str}`);
};

hint.warn = function () {
  let tips = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  console.log(`${_chalk2.default.yellow(tips)} ${str}`);
};

// copy from luna-client/lib/common/utils.js
function copyAndReplace(srcDir, destDir) {
  let data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  _glob2.default.sync('**', {
    cwd: srcDir,
    dot: true,
    ignore: ['**/**/.gitkeep', '.git/**']
  }).forEach(function (file) {
    let fromPath = _path2.default.join(srcDir, file);
    let destPath = _path2.default.join(destDir, file);

    if (_fs2.default.statSync(fromPath).isDirectory()) {
      if (!_fs2.default.existsSync(destPath)) {
        // 创建文件夹
        _fs2.default.mkdirSync(destPath);
      }
    } else {
      // 复制文件并替换内容
      let content = _fs2.default.readFileSync(fromPath).toString();
      for (let k in data) {
        let reg = new RegExp('<%=\\s*?' + k + '\\s*?%>', 'gi');
        if (reg.test(content)) {
          content = content.replace(reg, data[k]);
        }
      }
      // 将可能被忽略的变量替换为空字符串
      content = content.replace(/<%=\s*?[\w\d\-_]*\s*?%>/gi, '');
      // 写文件到当前目录
      _fs2.default.writeFileSync(destPath, content);
    }
  });
}

function* exec(cmd) {
  let option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  return new Promise(function (resolve, reject) {
    try {
      let stdout = '';
      let stderr = '';

      const ret = _shelljs2.default.exec(cmd, { silent: option.slient });

      if (!ret || ret.code !== 0) {
        throw new Error(ret && ret.stderr);
      } else {
        resolve(ret);
      }
    } catch (ex) {
      reject(ex);
    }
  });
}