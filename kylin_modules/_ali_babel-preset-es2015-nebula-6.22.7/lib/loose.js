'use strict';

exports.__esModule = true;
exports.looseFormat = looseFormat;
var looseKeyMap = exports.looseKeyMap = getLooseProperties(true);

function looseFormat(loose) {
  var map = {};

  if (loose === undefined) {
    map = getLooseProperties(false);
  } else if (getType(loose) === '[object Boolean]') {
    map = getLooseProperties(!!loose);
  } else if (getType(loose) === '[object Object]') {

    for (var k in loose) {
      if (!looseKeyMap[k]) {
        throw new Error('Preset es2015 \'loose\' option must not have \'' + k + '\' key.');
      }
    }
    for (var k in looseKeyMap) {
      map[k] = !!loose[k];
    }
  } else {
    throw new Error("Preset es2015 'loose' option must be a boolean or object.");
  }

  return map;
}

function getType(v) {
  return Object.prototype.toString.call(v);
}

function getLooseProperties(val) {

  var enable = !!val;

  return {
    'TemplateLiterals': enable,
    'Classes': enable,
    'ComputedProperties': enable,
    'ForOf': enable,
    'Spread': enable,
    'Destructuring': enable,
    'Modules': enable
  };
}