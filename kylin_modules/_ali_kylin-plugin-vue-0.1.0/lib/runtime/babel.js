'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateBabelImpl;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateBabelImpl() {

  return function babelModifyImpl(babelConfig) {

    console.log('可修改babel配置项', babelConfig);

    return babelConfig;
  };
}
//# sourceMappingURL=babel.js.map