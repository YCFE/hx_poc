"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackBaseConfig;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _getBabelCommonConfig = require("../config/getBabelCommonConfig");

var _getBabelCommonConfig2 = _interopRequireDefault(_getBabelCommonConfig);

var _globalResource = require("../plugin/globalResource");

var _core = require("cssnano/dist/lib/core");

var _core2 = _interopRequireDefault(_core);

var _index = require("../utils/index");

var _htmlWebpackChunkPathRelativePlugin = require("../plugin/htmlWebpackChunkPathRelativePlugin");

var _htmlWebpackChunkPathRelativePlugin2 = _interopRequireDefault(_htmlWebpackChunkPathRelativePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpackBaseConfig(program, kylinApp, option) {

  const babelQuery = (0, _getBabelCommonConfig2.default)(program, kylinApp);

  const postCssConfig = [require('autoprefixer')({
    //browsers: ['last 100 versions']
    browsers: ['Chrome >= 30', 'iOS >= 7', 'Android >= 2', 'ChromeAndroid >= 2', 'last 10 UCAndroid versions']
  }), program.prod ? _core2.default : null].filter(Boolean);

  return {
    babel: babelQuery,
    output: {
      path: _path2.default.resolve(program.cwd, kylinApp.output),
      publicPath: '',
      filename: '[name].js'
    },
    watch: program.watch,
    externals: kylinApp.options.enableGlobalResourceInject ? _globalResource.externals : {},
    resolve: {
      extensions: ['', '.jsx', '.js', '.vue', '.less', '.css'],
      alias: {} /* : {
                // 'vue$': 'vue/dist/vue.common.js',
                'vue$': require.resolve('vue/dist/vue.common.js'),
                }*/
    },
    module: {
      preLoaders: [
        /*{
         test: /\.vue$/,
         loader: 'eslint',
         include: projectRoot,
         exclude: /node_modules/
         },
         {
         test: /\.js$/,
         loader: 'eslint',
         include: projectRoot,
         exclude: /node_modules/
         }*/
      ],
      loaders: [{
        test: /\.vue$/,
        loader: require.resolve('@ali/kylin-vue-loader')
      }, {
        test: /\.js$/,
        // https://stackoverflow.com/questions/41928591/cannot-resolve-module-babel-after-installing-babel-nodejs
        loader: require.resolve('babel-loader'),
        include: program.cwd,
        exclude: /node_modules/,
        query: babelQuery
      }, {
        test: /\.json$/,
        loader: require.resolve('json-loader')
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        query: {
          limit: 10000,
          name: (0, _index.assetsPath)('img/[name].[hash:7].[ext]')
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        query: {
          limit: 10000,
          name: (0, _index.assetsPath)('fonts/[name].[hash:7].[ext]')
        }
      }].filter(Boolean)
    },
    vue: {
      preserveWhitespace: kylinApp.options.preserveWhitespace,
      esModule: true,
      loaders: (0, _index.cssLoaders)({ sourceMap: !program.prod, extract: false }),
      postcss: postCssConfig
    },
    postcss: () => {
      return postCssConfig;
    },
    plugins: [new _htmlWebpackChunkPathRelativePlugin2.default()]
  };
}
module.exports = exports["default"];