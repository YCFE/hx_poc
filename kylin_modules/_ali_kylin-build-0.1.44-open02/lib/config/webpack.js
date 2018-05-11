'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpackConfigFactory = webpackConfigFactory;

var _index = require('../utils/index');

var _options = require('./options');

var _babel = require('./babel');

var _index2 = require('../build/utils/index');

var _core = require('cssnano/dist/lib/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// /**
//  * 输入选项
//  * @param options
//  */
// export function webpackConfig(params = {}) {
//
//   params = userOption(params);
//   const { options } = params;
//   // const { options, env } = userOption(params);
//   //
//   // if ( env === 'production' ) {
//   //
//   //   const wc = require('../build/project/webpack.project.prod.conf')
//   //
//   // } else {
//   //
//   // }
//   // 根据options，来决定怎么处理
//   // 首先，构造一个默认的 kylinOptions
//   // 然后再看给用户开放哪些?
//
//
// }


/**
 * 输入原来的wc和选项
 * @param wc
 * @param options
 */
function webpackConfigFactory(wc, params) {

  params = (0, _options.userOption)(params);
  var _params = params;
  const options = _params.options;

  // 1. 把老的 vue-loader 移除，加入 @ali/kylin-vue-loader
  // 2. ext 中末尾加入 .vue 文件

  supportVueLoader(wc);

  // 3. 引入babel处理下
  // 3.1 如果没有babel，赋值一个上去 babelConfig
  // 3.2 如果有babel，做修改 babelConfigFactory
  if (wc.babel) {
    wc.babel = (0, _babel.babelConfigFactory)(wc.babel, params);
  } else {
    wc.babel = (0, _babel.babelConfig)(params);
  }

  // 4. wc.vue配置项
  supportVueConfig(wc, params);

  return wc;
} /**
   * 使用方
   * import { webpackConfig, webpackConfigFactory } from '@ali/kylin-build/lib/config/webpack';
   */


function getExtractCssEnable(wc) {

  let ret = false;
  let ExtractTextWebpackPlugin;

  try {
    ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
  } catch (ex) {
    return false;
  }

  wc.plugins.forEach(function (plugin, index) {
    if (plugin instanceof ExtractTextWebpackPlugin) {
      ret = true;
    }
  });

  return ret;
}

function supportVueConfig(wc, params) {
  const env = params.env,
        options = params.options;


  if (!wc.vue || params.forceVueConfig) {
    let pluginHasExtract = getExtractCssEnable(wc);

    wc.vue = {
      preserveWhitespace: options.preserveWhitespace,
      esModule: true,
      loaders: (0, _index2.cssLoaders)({
        sourceMap: false,
        extract: typeof params.vueStyleExtract === 'boolean' ? params.vueStyleExtract : pluginHasExtract, // 还要动态检测一下extractCss的支持
        publicPath: params.vueStylePublichPath
      }),
      postcss: wc.postcss || [require('autoprefixer')({
        browsers: ['Chrome >= 30', 'iOS >= 7', 'Android >= 2', 'ChromeAndroid >= 2', 'last 10 UCAndroid versions']
      }), env === 'production' ? _core2.default : null].filter(Boolean)
    };

    // 如果期望开extract，但是没加 抛一下warn
    if (params.vueStyleExtract && !pluginHasExtract) {
      _index.hint.error('[Style]', 'need plugin ExtractTextWebpackPlugin if params.vueStyleExtract=true');
    }
  }
}

function supportVueLoader(wc) {

  wc.module.loaders.forEach(function (loaderObj, index) {
    // 检测一下有没有vue-loader，有的话移除掉
    let hasVueLoader = false;
    if (typeof loaderObj.test === 'object') {
      hasVueLoader = hasVueLoader || loaderObj.test.test('a.vue');
    } else if (typeof loaderObj.test === 'function') {
      hasVueLoader = hasVueLoader || loaderObj.test('a.vue');
    }
    if (hasVueLoader) {
      wc.module.loaders.splice(index, 1);
    }
  });
  wc.module.loaders.push({
    test: /\.vue$/,
    loader: require.resolve('@ali/kylin-vue-loader')
  });

  if (!wc.resolve.extensions.filter(d => /^\.vue$/i.test(d)).length) {
    wc.resolve.extensions.push('.vue');
  }
}