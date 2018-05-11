'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateBuildImpl;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateBuildImpl(configPath) {

  return function webpackModifyImpl(webpackConfig) {

    var workingDir = _path2.default.dirname(configPath);
    var jsapiContextDir = _path2.default.resolve(workingDir, './jsapi/');
    var rpcContextDir = _path2.default.resolve(workingDir, './rpc/');

    var useContext = {
      jsapi: false,
      rpc: false
    };

    try {
      useContext.jsapi = _fs2.default.lstatSync(jsapiContextDir).isDirectory();
    } catch (ex) {}
    try {
      useContext.rpc = _fs2.default.lstatSync(rpcContextDir).isDirectory();
    } catch (ex) {}

    webpackConfig.plugins.unshift(new _webpack2.default.DefinePlugin({
      __KYLIN_PLUGIN_LUNA_MOCK_CONFIG__: JSON.stringify(configPath),
      __KYLIN_PLUGIN_LUNA_MOCK_WORKING_DIR__: JSON.stringify(workingDir),
      __KYLIN_PLUGIN_LUNA_MOCK_CONTEXT_JSAPI__: JSON.stringify(useContext.jsapi ? './context/jsapi.js' : './context/noop.js'),
      __KYLIN_PLUGIN_LUNA_MOCK_CONTEXT_RPC__: JSON.stringify(useContext.rpc ? './context/rpc.js' : './context/noop.js')
    }));

    return webpackConfig;
  };
}
//# sourceMappingURL=build.js.map