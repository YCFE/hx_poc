'use strict';

exports.__esModule = true;
exports.processor = processor;
exports.decorator = decorator;
var propertyKey = exports.propertyKey = 'components';
var prototypeKey = exports.prototypeKey = '$$Components';

function processor(proto, key, options) {
  "use strict";

  options.components = proto['$$Components'];
}

function decorator(proto, key, descriptor) {

  proto['$$Components'] = descriptor.initializer();
  delete proto[key];
}
//# sourceMappingURL=components.js.map