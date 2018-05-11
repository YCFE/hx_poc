'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('../../utils/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HtmlWebpackChunkPathRelativePlugin() {}

function getRelativePathLevel(chunkPath) {
  if (typeof chunkPath !== 'string') return 0;
  return chunkPath.split('/').length - 1;
}

function addRelativePath(url, count) {
  if (typeof url !== 'string') return '';
  if (count <= 0) return url;
  var ret = url;
  while (count--) {
    if (/^\//.test(ret)) {
      ret = `..${ret}`;
    } else {
      ret = `../${ret}`;
    }
  }
  return ret;
}

HtmlWebpackChunkPathRelativePlugin.prototype.apply = function (compiler) {

  compiler.plugin("compilation", function (compilation) {

    compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {

      var replaceMap = Object.create(null);
      var outPutName = htmlPluginData.outputName;

      //console.log(colors.blue(`ChunkRelative:: processing ${outPutName}`));
      var assets = htmlPluginData.assets;
      var chunks = assets.chunks;
      // 读取所有chunk, 找到有问题的chunk 及其  css  和 entry
      Object.keys(chunks).forEach(function (chunkName) {
        var chunkData = chunks[chunkName];

        if (!chunkData) return;

        var relativePathLevel = getRelativePathLevel(outPutName);

        if (relativePathLevel <= 0) return;

        // 处理 css 和 entry
        var css = chunkData.css || [];

        css.concat([chunkData.entry]).forEach(function (assetUrl) {
          var newAssetUrl = addRelativePath(assetUrl, relativePathLevel);

          replaceMap[assetUrl] = newAssetUrl;
        });
      });

      // 然后再遍历 js 和 css, 修改之前发现的有问题的
      assets.css.forEach(function (cssUrl, index) {
        if (replaceMap[cssUrl]) {
          (0, _index.hint)(`[Chunk]`, `replace css ${_safe2.default.blue(cssUrl)} to ${_safe2.default.blue(replaceMap[cssUrl])}`);
          assets.css[index] = replaceMap[cssUrl];
        }
      });

      assets.js.forEach(function (jsUrl, index) {
        if (replaceMap[jsUrl]) {
          (0, _index.hint)(`[Chunk]`, `replace css ${_safe2.default.blue(jsUrl)} to ${_safe2.default.blue(replaceMap[jsUrl])}`);
          assets.js[index] = replaceMap[jsUrl];
        }
      });

      callback(null, htmlPluginData);
    });
  });
};

exports.default = HtmlWebpackChunkPathRelativePlugin;
module.exports = exports['default'];