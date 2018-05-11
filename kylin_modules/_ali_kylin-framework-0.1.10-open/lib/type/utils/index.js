'use strict';

exports.__esModule = true;
exports.objectAssign = undefined;
exports.getVueVersion = getVueVersion;
exports.reactiveValueWrap = reactiveValueWrap;
exports.warn = warn;
exports.hasOwn = hasOwn;
exports.makeMap = makeMap;
exports.isSupportPromise = isSupportPromise;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var versionList = void 0;
function getVueVersion() {
  var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  if (!versionList) {
    versionList = (_vue2.default.version || '').split('.').map(function (d) {
      return parseInt(d, 10);
    });
  }
  return versionList[pos];
}

function reactiveValueWrap(keys, self) {
  "use strict";

  var ret = {};

  keys.forEach(function (k) {
    Object.defineProperty(ret, k, {
      enumerable: true,
      configurable: false,
      get: function get() {

        return self[k];
      },
      set: function set(v) {

        self[k] = v;
      }
    });
  });

  return ret;
}

function warn() {
  if (!console) return;

  var warnFunc = console.warn || console.log;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  warnFunc.apply(console, args);
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function makeMap(arr, defaultValue) {
  var ret = Object.create(null);
  arr.forEach(function (k) {
    ret[k] = defaultValue;
  });
  return ret;
}

function isSupportPromise(P) {
  var isSupport = false;
  try {
    var promise = null;
    var then = null;
    try {
      promise = P.resolve();
      then = promise.then;
    } catch (e) {}
    if (promise instanceof P && typeof then === 'function' && !P.cast) {
      isSupport = true;
    }
  } catch (e) {}

  return isSupport;
}

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function objectAssignPolyfill(target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  return to;
};

var objectAssign = exports.objectAssign = Object['ass' + 'ign'] || objectAssignPolyfill;
//# sourceMappingURL=index.js.map