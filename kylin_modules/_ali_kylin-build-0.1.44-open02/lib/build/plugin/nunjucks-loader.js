"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nunjucksFunctionLoader;
function nunjucksFunctionLoader(source) {

  if (this.cacheable) {
    this.cacheable();
  }

  const retModule = `
  module.exports = function nunjucksFunctionWrap(templateParams) {
    return ${JSON.stringify(source)};
  }
  `;

  return retModule;
}
module.exports = exports["default"];