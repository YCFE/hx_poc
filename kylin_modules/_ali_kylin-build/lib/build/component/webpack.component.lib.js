'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = webpackComponentLibConfig;

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _index = require('../utils/index');

var _index2 = require('../../utils/index');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ls = require('ls');

var _ls2 = _interopRequireDefault(_ls);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _webpackProgressPlugin = require('../plugin/webpackProgressPlugin');

var _webpackProgressPlugin2 = _interopRequireDefault(_webpackProgressPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPackagesEntry(program, kylinComponent) {
  (0, _assert2.default)(kylinComponent.packageDir, 'libMode need kylinComponent.packageDir');

  const packageDirPath = _path2.default.resolve(program.cwd, kylinComponent.packageDir, './*');

  const packageDirs = (0, _ls2.default)(packageDirPath, { recurse: false, type: 'dir' });

  const packageEntries = packageDirs.map(function (d) {
    return `${d.name}`;
  });

  const packageEntryMap = packageEntries.reduce(function (old, next) {
    old[`${next}`] = `./${kylinComponent.packageDir}/${next}/index.js`;
    return old;
  }, {});

  (0, _index2.hint)(`[Build]`, `packages`);
  console.log(packageEntryMap);

  return packageEntryMap;
}

function webpackComponentLibConfig(program, kylinComponent, option) {

  const baseWebpackConfig = require('./webpack.component.base')(program, _extends({}, kylinComponent, {
    output: ''
  }));

  baseWebpackConfig.entry = getPackagesEntry(program, kylinComponent);

  const componentConfig = (0, _webpackMerge2.default)(baseWebpackConfig, {
    output: {
      filename: `[name]/index.js`
    },
    module: {
      loaders: (0, _index.styleLoaders)({
        sourceMap: !program.prod,
        extract: true,
        publicPath: '../'
      })
    },
    vue: {
      loaders: (0, _index.cssLoaders)({
        sourceMap: !program.prod,
        extract: true,
        publicPath: '../'
      })
    },
    plugins: [(0, _webpackProgressPlugin2.default)(), program.compress ? new _webpack2.default.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }) : null, new _extractTextWebpackPlugin2.default('[name]/style.css'), new _webpack2.default.DefinePlugin(Object.assign({
      'process.env.NODE_ENV': '"production"',
      'process.env.KYLIN_COMPONENT_ENV': '"component_packages"'
    }, kylinComponent.env))].filter(Boolean)
  });

  return componentConfig;
}
module.exports = exports['default'];