'use strict';

exports.__esModule = true;
exports.prototypeKey = exports.propertyKey = undefined;
exports.processor = processor;
exports.decorator = decorator;
exports.Watch = Watch;

var _utils = require('../utils');

var propertyKey = exports.propertyKey = 'watch';
var prototypeKey = exports.prototypeKey = '$$Watch';

function processor(proto, key, options) {
  var watches = proto['$$Watch'];
  if (!watches) return;

  Object.keys(watches).forEach(function (k) {
    if (options.watch[k]) {
      (0, _utils.warn)('Watch [k] has duplicate handlers');
    }
    options.watch[k] = watches[k];
  });
}

function decorator(proto, key, descriptor) {
  "use strict";

  var watches = proto['$$Watch'] = proto['$$Watch'] || Object.create(null);
  var originalWatch = descriptor.initializer() || {};
  Object.keys(originalWatch).forEach(function (k) {
    watches[k] = originalWatch[k];
  });
}

function Watch(watchKey) {
  var watchOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  return function decorate(proto, methodName, descriptor) {
    var watches = proto['$$Watch'] = proto['$$Watch'] || Object.create(null);

    watchOption['handler'] = methodName;
    watches[watchKey] = watchOption;
  };
}
//# sourceMappingURL=watch.js.map