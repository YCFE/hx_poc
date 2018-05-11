'use strict';

const loaderUtils = require('loader-utils');
const parse = require('./parser');
const compile = require('./compiler').default;

module.exports = function loader(source) {
  if (!this.emitFile) {
    throw new Error('emitFile is required from module system');
  }

  const query = loaderUtils.getOptions(this) || {};
  const options = Object.assign({
    esModule: true
  }, this.options.vue, this.vue, query);

  Object.defineProperty(this.options, '__vueOptions__', {
    value: options,
    enumerable: false,
    configurable: true
  });
  return compile(this, parse(source, this.resource));
};

module.exports.loadVue = parse;