'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin')

const env = require('../config/prod.env')

const webpackConfig = baseWebpackConfig.map((el) => {
  const htmlPlugin = utils.htmlPlugin();
  const key = el.output.filename.split('/')[0];
  const htmlplugin = htmlPlugin[key];

  return merge(el, {
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
        usePostCSS: true
      })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
      path: config.build.assetsRoot,
      filename: `${key}/js/[name].[chunkhash:16].js`
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': env
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap: config.build.productionSourceMap,
        parallel: true
      }),
      // extract css into its own file
      new ExtractTextPlugin({
        filename: key + '/css/[name].[contenthash:16].css',
        allChunks: true,
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: config.build.productionSourceMap
          ? { safe: true, map: { inline: false } }
          : { safe: true }
      }),
      // keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin(),
      // enable scope hoisting
      new webpack.optimize.ModuleConcatenationPlugin(),
      // split vendor js into its own file
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common'
      }),
      new ReplaceInFileWebpackPlugin([{
        dir: `dist/${key}/`,
        test: /\.(css|js)$/,
        rules: [{
          search: /url\(\w+\//g,
          replace: 'url(../'
        }]
      },{
        dir: `dist/${key}/`,
        test: /\.html$/,
        rules: [{
          search: /\.\/(\w+\/)/g,
          replace: './'
        }]
      }])
    ].concat(htmlplugin)
  })
});

module.exports = webpackConfig
