'use strict';

exports.__esModule = true;
exports.modifier = modifier;
exports.processor = processor;
exports.decorator = decorator;
var propertyKey = exports.propertyKey = 'data';
var prototypeKey = exports.prototypeKey = '$$Data';

function modifier(options) {

  options.beforeCreate = options.beforeCreate || [];
  if (typeof options.beforeCreate === 'function') {
    options.beforeCreate = [options.beforeCreate];
  }
  options.beforeCreate.unshift(function dataInit() {
    Object.defineProperty(this, 'data', {
      enumerable: true,
      configurable: false,
      get: function get() {
        return this.$data;
      },
      set: function set(v) {}
    });
  });
}

function processor(proto, key, options) {
  "use strict";

  options.data = proto['$$Data'];
}

function decorator(proto, key, descriptor) {

  proto['$$Data'] = descriptor.initializer;
  delete proto[key];
}
//# sourceMappingURL=data.js.map