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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpackComponentIndexConfig(program, kylinComponent, option) {

  const baseWebpackConfig = require('../config/webpack.base.conf')(program, _extends({}, kylinComponent, {
    output: ''
  }));
  baseWebpackConfig.context = _path2.default.resolve(program.cwd, kylinComponent.sourceDir);
  baseWebpackConfig.entry = {};

  const componentConfig = (0, _webpackMerge2.default)(baseWebpackConfig, {
    output: {
      path: kylinComponent.buildDir,
      filename: '[name].js'
    },
    plugins: []
  });

  return componentConfig;
}
module.exports = exports['default'];