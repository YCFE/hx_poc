'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _index = require('../../utils/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as globalResouece from './globalResource.js';
function HtmlWebpackInjectPlugin() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  if (options && options.js) {
    this.resourceJs = Object.assign({}, options.js);
  } else {
    this.resourceJs = {};
  }

  if (options && options.css) {
    this.resourceCss = Object.assign({}, options.css);
  } else {
    this.resourceCss = {};
  }
}

HtmlWebpackInjectPlugin.prototype.apply = function (compiler) {

  let globalJS = this.resourceJs;
  let globalCSS = this.resourceCss;

  compiler.plugin("compilation", function (compilation) {

    var link_js_map = {};
    var link_css_map = {};

    // 读取用到了哪个chunk用了哪些全局的资源
    compilation.plugin('optimize-tree', function (chunks, modules, callback) {
      modules.forEach(function (module) {

        if (globalCSS[module.request] || globalJS[module.request]) {

          //hint(`[Resource]`, `detect module ${ colors.yellow(module.request) } imported`);
          //console.log(`GlobalResource:: detect module ${ colors.yellow(module.request) } imported`);

          module.chunks.forEach(function (chunk) {

            if (globalCSS[module.request]) {
              link_css_map[chunk.name] = link_css_map[chunk.name] || [];
              link_css_map[chunk.name].unshift(globalCSS[module.request]);
            }

            if (globalJS[module.request]) {
              link_js_map[chunk.name] = link_js_map[chunk.name] || [];
              link_js_map[chunk.name].unshift(globalJS[module.request]);
            }
          });
        }
      });
      callback();
    }.bind(this));

    compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {

      // html-webpack构造时unshift进使用到的全局资源
      for (var chunkName in htmlPluginData.assets.chunks) {

        //console.log(`GlobalResource:: html build for chunk ${ colors.blue(chunkName) }`);

        if (link_css_map[chunkName]) {
          link_css_map[chunkName].forEach(function (url) {

            (0, _index.hint)(`[Resource]`, `${_safe2.default.blue(chunkName)}: ${_safe2.default.blue(url)}`);
            //console.log(`GlobalResource:: add import css ${  colors.blue(url) }`);

            htmlPluginData.assets.css.unshift(url);
          });
        }

        if (link_js_map[chunkName]) {

          link_js_map[chunkName].forEach(function (url) {

            (0, _index.hint)(`[Resource]`, `${_safe2.default.blue(chunkName)}: ${_safe2.default.blue(url)}`);
            //console.log(`GlobalResource:: add import js ${  colors.blue(url) }`);

            htmlPluginData.assets.js.unshift(url);
          });
        }
      }
      callback(null, htmlPluginData);
    });
  });
};

function extend() {
  var args = Array.prototype.slice.call(arguments);
  var target = args.shift() || {};
  var source = args.shift();
  var deep = args.length;
  for (var p in source) {
    if (source.hasOwnProperty(p)) {
      target[p] = source[p];
    }
  }
  args.unshift(target);

  if (deep > 0) {
    return extend.apply(null, args);
  } else {
    return target;
  }
}

exports.default = HtmlWebpackInjectPlugin;
module.exports = exports['default'];