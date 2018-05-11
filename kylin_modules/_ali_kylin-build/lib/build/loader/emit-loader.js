'use strict';

const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function loader(source) {

  const relativeName = path.relative(this.options.context, this.resource).replace(/\.(less|sass|scss)$/, '.css');

  this.emitFile(relativeName, source);
  return '';
};