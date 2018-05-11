'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assetsPath = assetsPath;
exports.cssLoaders = cssLoaders;
exports.styleLoaders = styleLoaders;
exports.determineKylinConfig = determineKylinConfig;
exports.determineSourcemapType = determineSourcemapType;

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../../utils');

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function assetsPath(_path) {
  var assetsSubDirectory = ''; //'../';
  return _path3.default.posix.join(assetsSubDirectory, _path);
};

function cssLoaders(options) {
  options = options || {};
  // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar;
      if (/\?/.test(loader)) {
        //loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&';
      } else {
        //loader = loader + '-loader'
        extraParamChar = '?';
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '');
    }).join('!');

    // TODO webpack 是否自己解决了路径查找的问题
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      // 如果 new ExtractTextPlugin('xxx/[name].css') 这样出现修改输出css目录层级的行为，会导致background图片相对路径不对
      // 目前在webpack1下只能通过这个选项来调整
      const exteactOption = options.publicPath !== undefined ? {
        publicPath: options.publicPath
      } : {};

      return _extractTextWebpackPlugin2.default.extract(require.resolve('vue-style-loader'), sourceLoader, exteactOption);
    } else {
      // 见 http://gitlab.alipay-inc.com/kylin/build/issues/1
      if (options.styleLoader === false) {
        if (options.emit) {
          return [require.resolve('../loader/emit-loader.js'), sourceLoader].join('!');
        }
        return sourceLoader;
      } else {
        return [options.emit ? require.resolve('../loader/emit-loader') : require.resolve('vue-style-loader'), sourceLoader].join('!');
      }
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html

  // 如果能从cwd解析到，说明是拍平目录
  // 否则说明是npm@2的层叠目录
  let cssLoaderResolved = true;
  let lessLoaderResolved = true;
  let postcssLoaderResolved = true;

  try {
    _resolve2.default.sync('css-loader', { basedir: process.cwd() });
  } catch (ex) {
    cssLoaderResolved = false;
  }
  try {
    _resolve2.default.sync('less-loader', { basedir: process.cwd() });
  } catch (ex) {
    lessLoaderResolved = false;
  }
  try {
    _resolve2.default.sync('postcss-loader', { basedir: process.cwd() });
  } catch (ex) {
    postcssLoaderResolved = false;
  }

  var cssLoader = cssLoaderResolved ? 'css-loader?minimize=false' : require.resolve('css-loader') + '?minimize=false';

  var lessLoader = lessLoaderResolved ? 'less-loader' : require.resolve('less-loader');

  var postcssLoader = postcssLoaderResolved ? 'postcss-loader' : require.resolve('postcss-loader');

  function addPostcss(arr) {
    if (!options.postcss) return arr;
    if (options.emit) {
      return [postcssLoader].concat(arr.slice(1));
    }
    return [arr[0], postcssLoader].concat(arr.slice(1));
  }

  return {
    css: generateLoaders(addPostcss([cssLoader])),
    postcss: generateLoaders(addPostcss([cssLoader])),
    less: generateLoaders(addPostcss([cssLoader, lessLoader]))
  };
}

// Generate loaders for standalone style files (outside of .vue)
function styleLoaders(options) {
  var output = [];
  var loaders = exports.cssLoaders(options);
  for (var extension in loaders) {
    var loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    });
  }
  return output;
}

function determineKylinConfig(program, downgradePackageKey) {

  const cwd = program.cwd;
  // 如果定义了config-path
  if (program.configPath) {
    // 直接读取路径，相对于cwd

    const specificConfigPath = _path3.default.resolve(cwd, program.configPath);

    const configExists = _fs2.default.existsSync(specificConfigPath);

    // 如果存在，进行require解析
    if (configExists) {

      try {
        const configJson = require(specificConfigPath) || {};
        _utils.hint.warn(`[Config]`, `using config "${specificConfigPath}"`);
        return configJson;
      } catch (ex) {
        const errMsg = `specific config path "${_chalk2.default.yellow(specificConfigPath)}" ${_chalk2.default.red('is invalid json file')} using ${_chalk2.default.gray('--config-path "' + program.configPath + '"')} `;
        _utils.hint.error(`[Config]`, errMsg);
        throw new Error(errMsg);
      }
    } else {
      const errMsg = `specific config path "${_chalk2.default.yellow(specificConfigPath)}" ${_chalk2.default.red('does not exists')} using ${_chalk2.default.gray('--config-path "' + program.configPath + '"')} `;
      _utils.hint.error(`[Config]`, errMsg);
      throw new Error(errMsg);
    }
  } else {
    // 优先读取cwd下 kylin.config.js
    const configPath = 'kylin.config.js';
    const fillConfigPath = _path3.default.resolve(cwd, configPath);
    const configExists = _fs2.default.existsSync(fillConfigPath);

    if (configExists) {
      // 走读取配置
      try {
        const configJson = require(fillConfigPath) || {};
        _utils.hint.warn(`[Config]`, `using config "${fillConfigPath}"`);
        return configJson;
      } catch (ex) {
        const errMsg = `default config path "${_chalk2.default.yellow(fillConfigPath)}" ${_chalk2.default.red('is invalid json file')} `;
        _utils.hint.error(`[Config]`, errMsg);
        throw new Error(errMsg);
      }
    } else {
      // 不存在则降级kylinApp
      const specificConfigPath = `${cwd}/package.json`;
      const packageJson = require(specificConfigPath);
      _utils.hint.warn(`[Config]`, `using config "${specificConfigPath}"."${downgradePackageKey}"`);
      return packageJson[downgradePackageKey] || {};
    }
  }
}

function determineSourcemapType(sourcemap, isProd) {
  const DEV_DEFAULT_SOURCEMAP = 'eval-module-source-map';
  const PROD_DEFAULT_SOURCEMAP = 'source-map';
  let retSourcemap = false;
  if (sourcemap === undefined) {
    // 遵循默认规则
    retSourcemap = isProd ? false : DEV_DEFAULT_SOURCEMAP;
  } else if (typeof sourcemap === 'string') {
    // 遵循用户规则
    switch (sourcemap.toLowerCase()) {
      case 'false':case 'null':
        retSourcemap = false;
        break;
      default:
        retSourcemap = sourcemap;
    }
  } else if (sourcemap === true) {
    // 保持原样
    retSourcemap = isProd ? PROD_DEFAULT_SOURCEMAP : DEV_DEFAULT_SOURCEMAP;
  }

  return retSourcemap;
}