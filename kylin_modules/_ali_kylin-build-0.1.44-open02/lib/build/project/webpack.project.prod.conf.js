'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackProdConfig;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _index = require('../utils/index');

var _entry = require('../project/entry');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpackProgressPlugin = require('../plugin/webpackProgressPlugin');

var _webpackProgressPlugin2 = _interopRequireDefault(_webpackProgressPlugin);

var _htmlWebpackInjectPlugin = require('../plugin/htmlWebpackInjectPlugin');

var _htmlWebpackInjectPlugin2 = _interopRequireDefault(_htmlWebpackInjectPlugin);

var _globalResource = require('../plugin/globalResource');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* webpackProdConfig(program, kylinApp, option) {

  const htmlArray = yield (0, _entry.getHtmlPluginArray)(program, kylinApp);

  const baseWebpackConfig = require('../config/webpack.base.conf')(program, kylinApp, option);

  baseWebpackConfig.resolve.alias = Object.assign({}, baseWebpackConfig.resolve.alias, kylinApp.dirAlias);

  const commonChunkPluginOption = {
    name: 'common'
    // chunks: ['vendor']
  };

  if (kylinApp.options.minChunks !== undefined) {
    commonChunkPluginOption.minChunks = kylinApp.options.minChunks;
  }

  const webpackConfig = (0, _webpackMerge2.default)(baseWebpackConfig, {
    module: {
      loaders: (0, _index.styleLoaders)({ sourceMap: !!program.sourcemap, extract: true, publicPath: '../', postcss: true })
    },

    devtool: program.sourcemap,
    output: {
      path: option.assetsRoot,
      filename: (0, _index.assetsPath)(kylinApp.options.enableChunkHashName ? `js/[name].[hash:7].js` : `js/[name].js`),
      chunkFilename: (0, _index.assetsPath)(kylinApp.options.enableChunkHashName ? 'js/[id].[chunkhash:7].js' : `js/[id].js`)
    },
    vue: {
      loaders: (0, _index.cssLoaders)({
        sourceMap: !!program.sourcemap,
        extract: true,
        publicPath: '../'
      })
    },
    plugins: [new _htmlWebpackInjectPlugin2.default({
      js: Object.assign({}, _globalResource.js),
      css: Object.assign({}, _globalResource.css)
    }), (0, _webpackProgressPlugin2.default)(),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new _webpack2.default.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }), program.compress ? new _webpack2.default.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }) : null, program.order ? new _webpack2.default.optimize.OccurenceOrderPlugin() : null,
    // extract css into its own file
    new _extractTextWebpackPlugin2.default((0, _index.assetsPath)(kylinApp.options.enableChunkHashName ? 'css/[name].[hash:7].css' : 'css/[name].css')),

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    program.common ? new _webpack2.default.optimize.CommonsChunkPlugin(commonChunkPluginOption) : null].concat(htmlArray).filter(Boolean)
  });

  return webpackConfig;
}
module.exports = exports['default'];