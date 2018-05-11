'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeMap = makeMap;
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
}

const no = exports.no = (a, b, c) => false;