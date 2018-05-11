'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateBuildImpl;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateBuildImpl(option) {
  var variable = option.variable,
      exports = option.exports;


  return function webpackModifyImpl(webpackConfig) {
    if (Array.isArray(webpackConfig.plugins)) {
      if (typeof variable === 'object') {
        webpackConfig.plugins.push(new _webpack2.default.DefinePlugin(variable));
      }
      if (typeof exports === 'object') {
        var exportObject = {};
        Object.keys(exports).forEach(function (k) {
          exportObject[k] = process.env[exports[k]];
        });
        webpackConfig.plugins.push(new _webpack2.default.DefinePlugin(exportObject));
      }
    }

    return webpackConfig;
  };
}
//# sourceMappingURL=build.js.map