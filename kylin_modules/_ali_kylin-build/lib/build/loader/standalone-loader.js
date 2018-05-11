'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = standaloneLoader;

var _babelCore = require('babel-core');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function standaloneLoader(source) {
  const fileName = _path2.default.basename(this.resource);
  const emitName = _loaderUtils2.default.interpolateName(this, '[folder]/[name].js', { context: this.options.context });
  const options = _loaderUtils2.default.getOptions(this) || {};

  const relativeName = _path2.default.relative(this.options.context, this.resource);

  //debugger
  // console.log('standalone ', fileName, emitName, relativeName);

  this.emitFile(relativeName, (0, _babelCore.transform)(source, {
    presets: options.presets,
    plugins: options.plugins,
    minified: options.minified,
    comments: options.comments
  }).code);
  return '';
}
module.exports = exports['default'];