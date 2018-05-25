'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const vuxLoader = require('vux-loader');

const entries = utils.entries();

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

let webpackConfig = Object.keys(entries).map(el => {
  return {
    context: path.resolve(__dirname, '../'),
    entry: entries[el],
    output: {
      path: config.build.assetsRoot,
      filename: `${el}/js/[name].js`,
      publicPath:
        process.env.NODE_ENV === 'production'
          ? config.build.assetsPublicPath
          : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        mock: resolve('mock')
      }
    },
    externals: {
      vue: 'Vue',
      vuex: 'Vuex'
    },
    module: {
      rules: [
        ...(config.dev.useEslint ? [createLintingRule()] : []),
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            resolve('src'),
            resolve('test'),
            resolve('node_modules/webpack-dev-server/client')
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `./${el}/img/[name].[hash:7].[ext]`
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `./${el}/media/[name].[hash:7].[ext]`
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `./${el}/fonts/[name].[hash:7].[ext]`
          }
        }
      ]
    },
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  };
});

module.exports = webpackConfig.map((conf) => {
  const c = vuxLoader.merge(conf, {
    plugins: [
      'vux-ui',
      'progress-bar',
      {
        name: 'duplicate-style',
        options: {
          cssProcessorOptions : {
            safe: true,
            zindex: false,
            autoprefixer: {
              add: true,
              browsers: [
                'iOS >= 7',
                'Android >= 4.1'
              ]
            }
          }
        }
      }
    ]
  });
  return c;
});
