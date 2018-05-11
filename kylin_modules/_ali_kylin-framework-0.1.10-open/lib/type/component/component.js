'use strict';

exports.__esModule = true;
exports.ComponentDecoratorGenerator = ComponentDecoratorGenerator;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _index = require('../property/index.js');

var _utils = require('../utils');

var _connect = require('../connect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var metaKeys = ['props', 'computed', 'watch'];

function generateOptionFromMeta() {
  var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = arguments[1];


  meta.name = meta.name || name;
  metaKeys.forEach(function (k) {
    if (!(0, _utils.hasOwn)(meta, k)) {
      meta[k] = {};
    }
  });

  return meta;
}

function generateKeysFromProto(proto) {
  var protoKeys = Object.getOwnPropertyNames(proto);
  var internalKeys = [];
  var normalKeys = [];

  protoKeys.forEach(function (k) {
    if (k === 'constructor') {
      return;
    }

    if (isInternalKey(k)) {
      internalKeys.push(k);
    } else {
      normalKeys.push(k);
    }
  });

  return {
    internalKeys: internalKeys,
    normalKeys: normalKeys
  };

  function isInternalKey(k) {
    return String.prototype.substr.call(k, 0, 2) === '$$';
  }
}

function collectInternalProp(proto, key, options) {
  "use strict";

  (0, _index.PropertyProcessor)(proto, key, options);
}

var lifecycleHooks = _vue2.default.config._lifecycleHooks;

var lifecycHookMap = (0, _utils.makeMap)(lifecycleHooks, true);

function collectNormalProp(proto, key, options) {
  var descriptor = Object.getOwnPropertyDescriptor(proto, key);

  if (!descriptor) return;

  var lifecycleHooks = _vue2.default.config._lifecycleHooks;

  if (typeof descriptor.value === 'function') {
    if (lifecycHookMap[key]) {

      options[key] = options[key] || [];
      options[key] = Array.isArray(options[key]) ? options[key] : [options[key]];

      options[key].push(descriptor.value);
    } else if (key === 'render') {
      options[key] = descriptor.value;
    } else {
        options.methods = options.methods || {};
        if (options.methods[key]) {
          (0, _utils.warn)('member method [' + key + '] has duplicated definitions');
        }
        options.methods[key] = descriptor.value;
      }
  } else if (descriptor.get || descriptor.set) {
      options.computed[key] = {
        get: descriptor.get,
        set: descriptor.set
      };
    }
}

function ComponentDecoratorGenerator() {
  var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var connectFunc = null;
  var connectFuncExec = false;
  var hasMapExec = false;
  if ((0, _connect.hasConnectProperty)(meta)) {

    connectFuncExec = !!meta.mapExec;
    hasMapExec = typeof meta.mapExec !== 'undefined';
    connectFunc = (0, _connect.generateConnectFunc)(meta);
  }

  return function decorate(cls) {
    var proto = cls.prototype;

    var options = generateOptionFromMeta(meta, cls['name']);

    var _generateKeysFromProt = generateKeysFromProto(proto),
        internalKeys = _generateKeysFromProt.internalKeys,
        normalKeys = _generateKeysFromProt.normalKeys;

    internalKeys.forEach(function (k) {
      collectInternalProp(proto, k, options);
    });

    normalKeys.forEach(function (k) {
      collectNormalProp(proto, k, options);
    });

    (0, _index.modifyProperty)(options);

    if (connectFunc) {
      if (hasMapExec) {
        if (connectFuncExec) {
          options = connectFunc(options);
        } else {
          options['__kylin_connect_function__'] = connectFunc;
        }
      } else {
        var wrapOptions = connectFunc(options);
        wrapOptions['__kylin_connect_wrap__'] = {
          func: connectFunc,
          options: options
        };

        options = wrapOptions;
      }
    } else {}

    return options;
  };
}
//# sourceMappingURL=component.js.map