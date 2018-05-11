'use strict';

exports.__esModule = true;
exports.prototypeKey = exports.propertyKey = undefined;
exports.modifier = modifier;
exports.processor = processor;
exports.decorator = decorator;

var _index = require('../utils/index.js');

var propertyKey = exports.propertyKey = 'props';
var prototypeKey = exports.prototypeKey = '$$Props';

var propsProcessUseCustom = null;
function modifier(options) {

  options.beforeCreate = options.beforeCreate || [];
  if (typeof options.beforeCreate === 'function') {
    options.beforeCreate = [options.beforeCreate];
  }

  if (propsProcessUseCustom === null) {
    propsProcessUseCustom = (0, _index.getVueVersion)(1) <= 1;
  }

  if (propsProcessUseCustom) {
    options.beforeCreate.unshift(function propsInit() {
      Object.defineProperty(this, 'props', {
        enumerable: true,
        configurable: false,
        get: function get() {
          if (!this.$$PropsCache) {
            this.$$PropsCache = (0, _index.reactiveValueWrap)(Object.keys(options.props), this);
          }
          return this.$$PropsCache;
        },
        set: function set(v) {}
      });
    });
  } else {
    options.beforeCreate.unshift(function dataInit() {
      Object.defineProperty(this, 'props', {
        enumerable: true,
        configurable: false,
        get: function get() {
          return this.$props;
        },
        set: function set(v) {}
      });
    });
  }
};

function processor(proto, key, options) {
  "use strict";

  options.props = proto['$$Props'];
}

function decorator(proto, key, descriptor) {

  proto['$$Props'] = descriptor.initializer();
  delete proto[key];
}
//# sourceMappingURL=props.js.map