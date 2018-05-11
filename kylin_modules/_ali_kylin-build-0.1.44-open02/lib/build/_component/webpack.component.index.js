'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = webpackComponentIndexConfig;

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

var _cleanEmptyChunk = require('../plugin/clean-empty-chunk');

var _cleanEmptyChunk2 = _interopRequireDefault(_cleanEmptyChunk);

var _plugins = require('@ali/vue-pre-loader/lib/plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _standaloneLoader = require('../loader/standalone-loader');

var _standaloneLoader2 = _interopRequireDefault(_standaloneLoader);

var _entry = require('./entry');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpackComponentIndexConfig(program, kylinComponent, option) {

  const baseWebpackConfig = require('./webpack.component.base')(program, _extends({}, kylinComponent, {
    output: ''
  }));

  // resolve src folder files
  // TODO 切换成 全局
  baseWebpackConfig.entry = (0, _entry.resolveEntry)(program, kylinComponent);

  // change loader for new build type
  const loaders = baseWebpackConfig.module.loaders;
  for (const i in loaders) {
    if (loaders[i].test.toString() === /\.vue$/.toString()) {
      loaders[i].loader = require.resolve('@ali/vue-pre-loader');
      loaders[i].query = JSON.stringify({
        baseRelativeTo: _path2.default.resolve(program.cwd, kylinComponent.sourceDir),
        compressHTML: program.compress ? {
          caseSensitive: true,
          keepClosingSlash: true
        } : false
      });
    } else if (loaders[i].test.toString() === /\.js$/.toString()) {
      loaders[i].loader = require.resolve('../loader/standalone-loader');
    }
  }
  baseWebpackConfig.plugins.push(new _plugins2.default());

  const componentConfig = (0, _webpackMerge2.default)(baseWebpackConfig, {
    vue: {
      loaders: (0, _index.cssLoaders)({
        sourceMap: !program.prod,
        extract: false
      })
    },
    module: {
      loaders: (0, _index.styleLoaders)({
        sourceMap: !program.prod,
        extract: false,
        postcss: true,
        emit: true
      })
    },
    plugins: [new _cleanEmptyChunk2.default(), (0, _webpackProgressPlugin2.default)(), program.compress ? new _webpack2.default.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }) : null].filter(Boolean)
  });

  return componentConfig;
}
module.exports = exports['default'];