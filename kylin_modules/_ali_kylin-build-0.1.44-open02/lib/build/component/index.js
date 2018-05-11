"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _kylinOptions = require("../utils/kylinOptions");

var _kylinOptions2 = _interopRequireDefault(_kylinOptions);

var _utils = require("../utils");

var _shelljs = require("shelljs");

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _index = require("../../utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* init(program) {

  process.env.NODE_ENV = process.env.NODE_ENV === 'test' ? process.env.NODE_ENV : program.prod ? 'production' : 'development';
  (0, _index.hint)('[Build]', `NODE_ENV = ${process.env.NODE_ENV}`);
  // 1. 预处理 --dev语法糖
  const cwd = program.cwd;

  // 2. 做一些公用的预处理

  let kylinComponent = (0, _utils.determineKylinConfig)(program, 'kylinComponent');
  kylinComponent = preprocessKylinComponentConfig(kylinComponent);

  // 3. 根据 program.server进行路由,对应config初始化自行管理

  (0, _shelljs.mkdir)('-p', kylinComponent.buildDir);

  // 如果声明 packageDir 开启库模式
  try {

    if (kylinComponent.libMode) {
      yield buildPackages(program, kylinComponent);
    }

    yield buildIndex(program, kylinComponent);
  } catch (ex) {
    yield require('../log/index.js')(program, false, {
      type: 'component-old'
    });
    console.error(ex);
    process.exit(1);
  }

  yield require('../log/index.js')(program, true, {
    type: 'component-old'
  });
}

function* buildIndex(program, kylinComponent) {

  console.log();
  (0, _index.hint)(`[Build]`, `build for index entry`);

  const webpackComponentIndex = require('./webpack.component.index')(program, kylinComponent);

  return new Promise(function (resolve, reject) {

    (0, _webpack2.default)(webpackComponentIndex, function (err, stats) {
      if (err) {
        reject(err);
        return;
      }
      process.stdout.write(stats.toString({
        colors: true,
        modules: !!program.verbose,
        children: !!program.verbose,
        chunks: !!program.verbose,
        chunkModules: !!program.verbose
      }) + '\n');
      resolve();
    });
  });
}

function* buildPackages(program, kylinComponent) {

  console.log();
  (0, _index.hint)(`[Build]`, `build for packages`);

  const webpackComponentIndex = require('./webpack.component.lib')(program, kylinComponent);

  return new Promise(function (resolve, reject) {

    (0, _webpack2.default)(webpackComponentIndex, function (err, stats) {
      if (err) {
        reject(err);
        return;
      }
      process.stdout.write(stats.toString({
        colors: true,
        modules: !!program.verbose,
        children: !!program.verbose,
        chunks: !!program.verbose,
        chunkModules: !!program.verbose
      }) + '\n');
      resolve();
    });
  });
}

function preprocessKylinComponentConfig(kylinComponent) {

  const kylinComponentDefault = {
    entry: 'index',
    sourceDir: './src',
    buildDir: './dist',
    notExternals: [],
    library: 'kylinComponent',
    libMode: false,
    env: {},
    plugins: [],
    parsedPlugins: []
  };

  kylinComponent = Object.assign(kylinComponentDefault, kylinComponent);

  kylinComponent.options = (0, _kylinOptions2.default)(kylinComponent.options);

  // default packageDir
  if (kylinComponent.libMode && !kylinComponent.packageDir) {
    kylinComponent.packageDir = 'packages';
  }

  return kylinComponent;
}
module.exports = exports["default"];