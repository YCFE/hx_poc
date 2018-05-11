'use strict';

const postcss = require('postcss');
const loaderUtils = require('loader-utils');
const loadPostcssConfig = require('./utils/load-postcss-config');
const trim = require('./plugins/trim');

module.exports = function (css, map) {
  this.cacheable();
  const cb = this.async();

  const query = loaderUtils.getOptions(this) || {};
  let vueOptions = this.options.__vueOptions__;
  if (!vueOptions) {
    if (query.hasInlineConfig) {
      this.emitError(`\n  [vue-loader] It seems you are using HappyPack with inline postcss ` + `options for vue-loader. This is not supported because loaders running ` + `in different threads cannot share non-serializable options. ` + `It is recommended to use a postcss config file instead.\n` + `\n  See http://vue-loader.vuejs.org/en/features/postcss.html#using-a-config-file for more details.\n`);
    }
    vueOptions = Object.assign({}, this.options.vue, this.vue);
  }

  loadPostcssConfig(this, vueOptions.postcss).then(config => {
    const plugins = [trim].concat(config.plugins);
    const options = Object.assign({
      to: this.resourcePath,
      from: this.resourcePath,
      map: false
    }, config.options);

    return postcss(plugins).process(css, options).then(result => {
      if (result.messages) {
        result.messages.forEach(m => {
          if (m.type === 'dependency') {
            this.addDependency(m.file);
          }
        });
      }
      const map = result.map && result.map.toJSON();
      cb(null, result.css, map);
      return null;
    });
  }).catch(e => {
    console.error(e);
    cb(e);
  });
};