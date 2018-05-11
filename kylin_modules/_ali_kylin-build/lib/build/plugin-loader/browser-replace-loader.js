'use strict';

var loaderUtils = require('loader-utils');

module.exports = function browserReplaceLoader(source) {
  //
  if (this.cacheable) {
    this.cacheable();
  }
  //
  var paths = [];
  try {
    var query = loaderUtils.getOptions(this) || {};

    var pathsStr = query.paths || '[]';
    paths = JSON.parse(pathsStr);
  } catch (ex) {}
  //
  // // 开始替换
  try {
    var retModule = source.replace('__TO_BE_REPLACE_PLUGIN_PATH_ARRAY__', '[\n' + paths.map(function (p) {
      return `require(${JSON.stringify(p)})`;
    }).join(',\n') + ']\n');

    return retModule;
  } catch (ex) {
    return source;
  }
};