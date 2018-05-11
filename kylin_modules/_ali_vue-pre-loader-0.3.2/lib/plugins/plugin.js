'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('../index');

var _dumpVue = require('./dump-vue');

var _dumpVue2 = _interopRequireDefault(_dumpVue);

var _webpackSources = require('webpack-sources');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class VuePreLoaderPlugin {
  /**
   * @param test 匹配处理文件
   */
  constructor(options) {
    this.onEmit = (compilation, callback) => {
      this.compilation = compilation;

      this.assets = Object.keys(compilation.assets).map(name => ({ name: name, value: compilation.assets[name].source() }));
      this.assets.filter(i => this.options.test.test(i.name)).forEach(this.handleVueAsset);

      if (this.options.removeFile) {
        for (const key in this.compilation.assets) {
          if (this.options.removeFile.test(key)) {
            delete this.compilation.assets[key];
          }
        }
      }

      callback();
    };

    this.handleVueAsset = asset => {
      const parsed = (0, _index.loadVue)(asset.value);
      (parsed.styles || []).forEach((style, index) => {
        const name = `${asset.name}__vue_pre_loader_.${index}.css`;
        const parsedStyle = parsed.styles[index];
        const styleAsset = this.assets.find(i => i.name === name);

        if (!style.attrs.generated || !styleAsset) {
          delete parsedStyle.attrs.generated;
        } else {
          parsedStyle.content = styleAsset.value;
          delete parsedStyle.attrs.generated;
          delete parsedStyle.src;
          delete parsedStyle.attrs.src;
          delete parsedStyle.attrs.lang;
          delete parsedStyle.attrs.rel;
        }
        delete this.compilation.assets[name];
      });

      if (parsed.script && parsed.script.attrs && parsed.script.attrs.generated) {
        const scriptAsset = this.assets.find(i => i.name === `${asset.name}__vue_pre_loader_.js`);
        delete this.compilation.assets[`${asset.name}__vue_pre_loader_.js`];
        delete this.compilation.assets[`${asset.name}.js`];
        if (scriptAsset) {
          delete parsed.script.src;
          delete parsed.script.attrs.src;
          // keep generated in 0.3.x
          // delete parsed.script.attrs.generated;
          parsed.script.content = scriptAsset.value;
        }
      }
      this.compilation.assets[asset.name] = new _webpackSources.RawSource((0, _dumpVue2.default)(parsed));
    };

    this.options = Object.assign({
      test: /\.vue$/,
      removeFile: /\.js\.js$/
    }, options);
  }

  apply(compiler) {
    compiler.plugin('emit', this.onEmit);
  }

}
exports.default = VuePreLoaderPlugin;
module.exports = exports['default'];