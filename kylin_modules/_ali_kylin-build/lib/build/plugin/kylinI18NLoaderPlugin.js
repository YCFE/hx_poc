'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackLangConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('../../utils/index');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLangConfigStatus(program, kylinApp) {
  const langConfigDir = _path2.default.resolve(program.cwd, kylinApp.options.defaultLangConfigDir);

  const ret = {
    dir: {},
    files: {},
    lib: {}
  };

  try {
    const fileStat = _fs2.default.statSync(langConfigDir);
    if (fileStat.isDirectory()) {
      ret.dir = {
        success: true,
        msg: `[${langConfigDir}] 目录存在`
      };
      // 尝试读取文件列表
      const fileList = _glob2.default.sync(_path2.default.resolve(langConfigDir, '*.js'));
      if (fileList.length > 0) {
        ret.files = {
          success: true,
          msg: `[${kylinApp.options.defaultLangConfigDir}] 包含语言文件[ ${_chalk2.default.yellow(fileList.map(p => _path2.default.relative(langConfigDir, p)).join(', '))}]`
        };
      } else {
        ret.files = {
          success: false,
          msg: `[${_chalk2.default.red(kylinApp.options.defaultLangConfigDir)}] 目录不包含${_chalk2.default.red('*.js')}文件`
        };
      }
    } else {
      ret.dir = {
        success: false,
        msg: `[${_chalk2.default.red(langConfigDir)}] 不是目录`
      };
    }
  } catch (ex) {
    ret.dir = {
      success: false,
      msg: `[${_chalk2.default.red(langConfigDir)}] 目录不存在`
    };
  }

  try {
    const libI18N = require.resolve(kylinApp.options.defaultLangLib);
    if (libI18N) {
      ret.lib = {
        success: true,
        msg: `[${kylinApp.options.defaultLangLib}] 依赖存在`
      };
    } else {
      ret.lib = {
        success: false,
        msg: `[${_chalk2.default.red(kylinApp.options.defaultLangLib)}] 依赖不存在`
      };
    }
  } catch (ex) {
    ret.lib = {
      success: false,
      msg: `[${_chalk2.default.red(kylinApp.options.defaultLangLib)}] 依赖不存在`
    };
  }

  return ret;
}

function webpackLangConfig(program, kylinApp, webpackConfig) {
  const langConfigDir = _path2.default.resolve(program.cwd, kylinApp.options.defaultLangConfigDir);

  let enableKylinI18N = kylinApp.options.enableKylinI18N;

  const statusMap = getLangConfigStatus(program, kylinApp);
  const dir = statusMap.dir,
        files = statusMap.files,
        lib = statusMap.lib;
  // 如果存在 langConfigDir 目录里面至少有1个文件，require.resolve("@ali/kylin-i18n") 存在  这是必要条件

  const outputMsg = Object.keys(statusMap).map(k => statusMap[k]).filter(v => v.msg).map(v => ` ${v.success ? _chalk2.default.green(`[√] ${v.msg}`) : _chalk2.default.red(`[×] ${v.msg}`)}\n`).join('');

  if (dir.success && files.success && lib.success) {
    if (enableKylinI18N === false) {
      // 手动关闭多语言
      _index.hint.warn(`[i18n]`, `${_chalk2.default.yellow(`未开启多语言`)}`);
    } else {
      enableKylinI18N = true;
      _index.hint.success(`[i18n]`, `${_chalk2.default.green(`开启多语言`)}\n${outputMsg}`);
    }
  } else {
    if (enableKylinI18N) {
      enableKylinI18N = false;
      _index.hint.error(`[i18n]`, `开启多语言依赖以下条件:\n${outputMsg}`);
    }
  }

  // 如果满足上面的, 那么自动开启, 除非手动关闭
  // 如果不满足上面，但是手动开启了，把具体错误报出来

  if (enableKylinI18N) {
    const kylinI18NLoaderEntry = _path2.default.resolve(__dirname, '../plugin/kylinI18NLoader');

    // 假定 webpackConfig.entry 是一个 object
    Object.keys(webpackConfig.entry).forEach(key => {
      const entryVal = webpackConfig.entry[key];
      if (Array.isArray(entryVal)) {
        entryVal.unshift(kylinI18NLoaderEntry);
      } else {
        webpackConfig.entry[key] = [kylinI18NLoaderEntry, entryVal];
      }
    });

    webpackConfig.plugins.push(
    // 修改loader中的 目录require
    new _webpack2.default.ContextReplacementPlugin(/^__kylinI18NLangDir__$/, langConfigDir, false, /\.js$/i));
  }

  return webpackConfig;
}
module.exports = exports['default'];