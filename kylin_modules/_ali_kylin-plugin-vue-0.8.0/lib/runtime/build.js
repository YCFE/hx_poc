'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateBuildImpl;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateBuildImpl(option) {
  var useExternal = option.external === undefined ? true : !!option.external;

  return function webpackModifyImpl(webpackConfig) {
    if (!useExternal) {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
      webpackConfig.resolve.alias['vue$'] = require.resolve('vue/dist/vue.common.js');
    }

    return webpackConfig;
  };
}
//# sourceMappingURL=build.js.map