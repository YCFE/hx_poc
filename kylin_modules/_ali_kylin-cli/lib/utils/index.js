'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWin = undefined;
exports.question = question;
exports.hint = hint;
exports.copyAndReplaceForFile = copyAndReplaceForFile;
exports.copyAndReplace = copyAndReplace;
exports.exec = exec;
exports.parseNameDash = parseNameDash;
exports.parseNameCamel = parseNameCamel;
exports.getOutputAbsDir = getOutputAbsDir;
exports.gitlabCloneForLocal = gitlabCloneForLocal;

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

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isWin = exports.isWin = /^win/.test(process.platform);

function question(prompts) {
  return new Promise(function (resolve, reject) {
    _inquirer2.default.prompt(prompts).then(resolve, reject);
  });
}

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

function copyAndReplaceForFile(fromPath, destPath) {
  let data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!_fs2.default.existsSync(fromPath)) return;

  _mkdirp2.default.sync(_path2.default.dirname(destPath));

  if (_fs2.default.statSync(fromPath).isDirectory()) {
    if (!_fs2.default.existsSync(destPath)) {
      // 创建文件夹
      _mkdirp2.default.sync(destPath);
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
}

// copy from luna-client/lib/common/utils.js
function copyAndReplace(srcDir, destDir) {
  let data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let ignoreList = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  if (!_fs2.default.existsSync(destDir)) {
    _mkdirp2.default.sync(destDir);
  }

  _glob2.default.sync('**', {
    cwd: srcDir,
    dot: true,
    ignore: ['**/**/.gitkeep', '.git/**'].concat(ignoreList)
  }).forEach(function (file) {

    let fromPath = _path2.default.join(srcDir, file);
    let destPath = _path2.default.join(destDir, file);

    copyAndReplaceForFile(fromPath, destPath, data);
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

/**
 * 处理为中划线命名 page-name
 * @param pageName
 */
function parseNameDash(_str) {

  const str = _str[0].toLowerCase() + _str.substr(1);
  return str.replace(/([A-Z])/g, function camel2DashReplace($1) {
    return '-' + $1.toLowerCase();
  });
}

/**
 * 处理为驼峰式命名，
 * @param pageName
 * @param {Boolean} forceFirstCap 是否强制首字母大写
 */
function parseNameCamel(_str, forceFirstCap) {
  let str = _str.replace(/(\-[a-z])/g, function dash2CamelReplace($1) {
    return $1.substr(1).toUpperCase();
  });

  const outStr = forceFirstCap ? str[0].toUpperCase() + str.substr(1) : str;
  return outStr;
}

function getOutputAbsDir(program, outputDir) {
  const ret = _path2.default.join(program.cwd, _path2.default.relative(program.cwd, outputDir));
  return ret;
}

function* gitlabCloneForLocal(_ref) {
  let tmp = _ref.tmp,
      template = _ref.template,
      program = _ref.program;


  const templatePath = _path2.default.resolve(program.cwd, program.templatePath, template);
  _fsExtra2.default.copySync(templatePath, tmp);
}