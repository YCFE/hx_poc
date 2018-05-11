'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dumpVue;
function dumpVue(vue) {
  let result = '';
  result += dumpBlock(vue.template) + '\n';
  result += (vue.styles || []).map(dumpBlock).join('\n') + '\n';
  result += dumpBlock(vue.script) + '\n';
  result += (vue.customBlocks || []).map(dumpBlock).join('') + '\n';
  return result;
}

function dumpBlock(h) {
  if (!h) {
    return '';
  }
  return `<${h.type}${Object.keys(h.attrs).map(key => ` ${key}${h.attrs[key] === true ? '' : `="${h.attrs[key]}"`}`).join('')}>${h.content}</${h.type}>`;
}
module.exports = exports['default'];