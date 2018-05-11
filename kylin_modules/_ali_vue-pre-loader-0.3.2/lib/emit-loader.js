'use strict';

const loaderUtils = require('loader-utils');

module.exports = function loader(source) {
  const params = loaderUtils.parseQuery(this.query);
  if (!params.fileName) {
    return '';
  }
  this.emitFile(params.fileName, source);
  return '';
};