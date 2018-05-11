"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _entry = require("./entry");

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _index = require("../../utils/index.js");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _kylinI18NLoaderPlugin = require("../plugin/kylinI18NLoaderPlugin");

var _kylinI18NLoaderPlugin2 = _interopRequireDefault(_kylinI18NLoaderPlugin);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _index2 = require("../plugin-loader/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* build(program, kylinApp) {

  // 1. 先判断 nebulaTarget
  const options = kylinApp.options;
  const nebulaTargetArr = options.nebulaTargetArr,
        nebulaTarget = options.nebulaTarget,
        originalNebulaTarget = options.originalNebulaTarget;

  // 2. 如果需要进行多target处理，的放给具体构建进行
  // 如果用户无输入


  if (!originalNebulaTarget) {
    yield buildForTarget(program, kylinApp, {
      target: nebulaTarget, // 被补全成common,
      assetsRoot: kylinApp.output
    });
  } else {
    // 顺序化构建

    for (let target of nebulaTargetArr) {
      yield buildForTarget(program, kylinApp, {
        target: target,
        assetsRoot: _path2.default.join(kylinApp.output, target)
      });
    }
  }
}

function* buildForTarget(program, kylinApp) {
  let option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _option$target = option.target;
  const target = _option$target === undefined ? "common" : _option$target,
        assetsRoot = option.assetsRoot;


  kylinApp.options.nebulaTarget = target;

  console.log();
  (0, _index.hint)('[Build]', `NODE_ENV = ${process.env.NODE_ENV}`);
  (0, _index.hint)('[Build]', `nebulaTarget = ${target}`);
  (0, _index.hint)('[Build]', `assetsRoot = ${assetsRoot}`);

  // webpack config
  const webpackConfigFactory = program.prod ? require('./webpack.project.prod.conf') : require('./webpack.project.dev.conf');
  let webpackConfig = yield webpackConfigFactory(program, kylinApp, {
    assetsRoot: assetsRoot
  });
  webpackConfig.entry = (0, _entry.getEntry)(program, kylinApp);

  if (!(0, _index2.hasPluginId)(program, kylinApp, "@ali/kylin-plugin-i18n")) {
    webpackConfig = (0, _kylinI18NLoaderPlugin2.default)(program, kylinApp, webpackConfig);
  }

  const externalEntry = (0, _entry.getExternalEntry)(program, kylinApp);

  try {
    webpackConfig = yield (0, _index2.applyPluginForWebpack)(webpackConfig, kylinApp);
  } catch (ex) {
    _index.hint.error(`[Config]`, `applying plugin for webpack phase error`);
    _index.hint.error(`[Config]`, ex);
    throw ex;
  }

  const wcPath = _path2.default.resolve(program.cwd, kylinApp.options.defaultWebpackConfigFactoryPath);

  try {

    if (_fs2.default.existsSync(wcPath)) {
      const webpackConfigDefineFactory = require(wcPath);
      if (typeof webpackConfigDefineFactory === 'function') {
        webpackConfig = webpackConfigDefineFactory(webpackConfig) || webpackConfig;
      } else {
        _index.hint.error(`[Config]`, `webpack.config is not function with path [${wcPath}]`);
      }
    }
  } catch (ex) {
    _index.hint.error(`[Config]`, `webpack.config process error with path [${wcPath}]`);
    _index.hint.error(`[Config]`, ex);
  }

  return new Promise(function (resolve, reject) {

    (0, _webpack2.default)(webpackConfig, function (err, stats) {
      if (err) {
        reject(err.stack || err);
        if (err.details) {
          reject(err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        reject(info.errors.join('\n'));
      } else {
        process.stdout.write(stats.toString({
          colors: true,
          modules: !!program.verbose,
          children: !!program.verbose,
          chunks: !!program.verbose,
          chunkModules: !!program.verbose
        }) + '\n');
        resolve();
      }
    });
  });
}
module.exports = exports["default"];