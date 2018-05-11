'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackDevConfig;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('../utils/index');

var _entry = require('../project/entry');

var _webpackProgressPlugin = require('../plugin/webpackProgressPlugin');

var _webpackProgressPlugin2 = _interopRequireDefault(_webpackProgressPlugin);

var _htmlWebpackInjectPlugin = require('../plugin/htmlWebpackInjectPlugin');

var _htmlWebpackInjectPlugin2 = _interopRequireDefault(_htmlWebpackInjectPlugin);

var _globalResource = require('../plugin/globalResource');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* webpackDevConfig(program, kylinApp, option) {

  const baseWebpackConfig = require('../config/webpack.base.conf')(program, kylinApp, option);
  // add hot-reload related code to entry chunks

  let loaders = (0, _index.styleLoaders)({ sourceMap: !!program.sourcemap, postcss: true });
  loaders.push({
    test: /\.js$/,
    loader: require.resolve("source-map-loader"),
    include: [
    // TODO  解决 node_modules  source_map debug 问题
    // 测试
    _path2.default.resolve(program.cwd, '../../'),
    // 正式环境 kylin 相关代码
    new RegExp(`${program.cwd}/node_modules/.*\@\@ali/kylin-\w*/`)],
    exclude: null,
    enforce: "pre"
  });

  const htmlArray = yield (0, _entry.getHtmlPluginArray)(program, kylinApp);

  baseWebpackConfig.resolve.alias = Object.assign({}, baseWebpackConfig.resolve.alias, kylinApp.dirAlias);

  return (0, _webpackMerge2.default)(baseWebpackConfig, {
    module: {
      loaders: loaders
    },
    // eval-source-map is faster for development
    devtool: program.sourcemap,
    output: {
      path: option.assetsRoot,
      filename: (0, _index.assetsPath)(kylinApp.options.enableChunkHashName ? `js/[name].[hash:7].js` : `js/[name].js`),
      chunkFilename: (0, _index.assetsPath)(kylinApp.options.enableChunkHashName ? 'js/[id].[chunkhash:7].js' : `js/[id].js`)
    },
    plugins: [new _htmlWebpackInjectPlugin2.default({
      js: Object.assign({}, _globalResource.js, kylinApp.options.customVueUrl ? {
        'Vue': kylinApp.options.customVueUrl
      } : {}),
      css: Object.assign({}, _globalResource.css)
    }), (0, _webpackProgressPlugin2.default)(), new _webpack2.default.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    program.order ? new _webpack2.default.optimize.OccurenceOrderPlugin() : null, program.hot && program.server ? new _webpack2.default.HotModuleReplacementPlugin() : null, new _webpack2.default.NoErrorsPlugin()].concat(htmlArray).filter(Boolean)
  });
}
module.exports = exports['default'];