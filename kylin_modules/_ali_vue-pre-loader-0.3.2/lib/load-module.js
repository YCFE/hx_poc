'use strict';

const loaderUtils = require('loader-utils');
const tryRequire = require('./utils/try-require');

const hasBabel = !!tryRequire('babel-loader');
const hasBuble = !!tryRequire('buble-loader');
const hasPostcss = !!tryRequire('postcss');

const noop = () => undefined;

module.exports = class LoadModule {
  static init(context, moduleString) {
    return new LoadModule(context, moduleString);
  }

  constructor(context, moduleString) {
    this.context = context;
    this.moduleString = moduleString;
    this.options = loaderUtils.getOptions(context) || {};
  }

  select(type, index) {
    this.moduleString = `${require.resolve('./selector-loader')}?type=${type}${index ? `&index=${index}` : ''}!${this.moduleString}`;
    return this;
  }

  compileStyle(lang) {
    if (lang) {
      this.moduleString = `${lang}-loader!${this.moduleString}`;
    }
    if (hasPostcss) {
      this.moduleString = `${require.resolve('./postcss-loader')}!${this.moduleString}`;
    }
    return this;
  }

  compileScript() {
    this.moduleString = `${hasBuble ? 'buble-loader' + this.bubleOptions() : hasBabel ? 'babel-loader' : ''}!${this.moduleString}`;
    return this;
  }

  emit(fileName) {
    return `!!${require.resolve('./emit-loader')}?fileName=${fileName}!${this.moduleString}`;
  }

  bubleOptions() {
    const options = Object.assign({
      esModule: true
    }, this.context.options.vue, this.context.vue, this.options);
    return hasBuble && options.buble ? '?' + JSON.stringify(options.buble) : '';
  }

};