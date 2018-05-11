'use strict';

exports.__esModule = true;
exports.toArray = toArray;
exports.camelToKebab = camelToKebab;
exports.merge = merge;
exports.pick = pick;
exports.omit = omit;
exports.mapValues = mapValues;
exports.keys = keys;
function toArray(args) {

  var slice = Array.prototype.slice;
  return slice.call(args);
}

function camelToKebab(str) {
  return str.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

function merge() {
  var target = {};

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  args.forEach(function (obj) {
    Object.keys(obj).forEach(function (key) {
      target[key] = obj[key];
    });
  });
  return target;
}

function pick(obj, keys) {
  var res = {};
  keys.forEach(function (key) {
    if (obj[key] !== void 0) {
      res[key] = obj[key];
    }
  });
  return res;
}

function omit(obj, keys) {
  var res = {};
  Object.keys(obj).forEach(function (key) {
    if (!includes(keys, key)) {
      res[key] = obj[key];
    }
  });
  return res;
}

function mapValues(obj, f) {
  var res = {};
  Object.keys(obj).forEach(function (key) {
    res[key] = f(obj[key], key);
  });
  return res;
}

function keys() {
  return Object.keys(merge.apply(undefined, arguments));
}

function includes(array, item) {
  return array.indexOf(item) > -1;
}
//# sourceMappingURL=utils.js.map