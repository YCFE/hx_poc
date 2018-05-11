"use strict";

exports.__esModule = true;
exports.processor = processor;
exports.decorator = decorator;
var exceptNames = exports.exceptNames = {
  name: true,
  filters: true
};

function processor(proto, $$key, options) {
  "use strict";

  var optionName = $$key.slice(2);
  var addValue = proto[$$key];
  if (options[optionName] && !exceptNames[optionName]) {
    console && console.warn && console.warn("Property [" + optionName + "] will override options[" + optionName + "]");
  }
  options[optionName] = addValue;
}

function decorator(proto, key, descriptor) {

  proto["$$" + key] = descriptor.initializer();
  delete proto[key];
}
//# sourceMappingURL=default.js.map