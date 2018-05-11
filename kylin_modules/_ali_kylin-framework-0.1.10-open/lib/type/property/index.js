'use strict';

exports.__esModule = true;
exports.Watch = undefined;
exports.modifyProperty = modifyProperty;
exports.PropertyProcessor = PropertyProcessor;
exports.Property = Property;

var _watch = require('./watch');

Object.defineProperty(exports, 'Watch', {
  enumerable: true,
  get: function get() {
    return _watch.Watch;
  }
});

var _utils = require('../utils');

var _default = require('./default');

var DefaultProperty = _interopRequireWildcard(_default);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var decoratorMap = Object.create(null);
var processorMap = Object.create(null);
var modifierArray = [];

function modifyProperty(options) {
  modifierArray.forEach(function (func) {
    func(options);
  });
}

function PropertyDecorator(target, key, descriptor) {
  "use strict";

  if (typeof decoratorMap[key] === 'function') {
    decoratorMap[key](target, key, descriptor);
  } else {
      DefaultProperty.decorator(target, key, descriptor);
    }
}

function PropertyProcessor(proto, key, options) {
  "use strict";

  if (typeof processorMap[key] === 'function') {
    processorMap[key](proto, key, options);
  } else {
      DefaultProperty.processor(proto, key, options);
    }
}

function registerProperty(config) {
  "use strict";

  if (!config) {
    throw new Error('registerProperty config invalid', config);
  }

  if (!config.propertyKey || !config.prototypeKey || !config.processor || !config.decorator) {
    throw new Error('registerProperty config invalid', config);
  }

  decoratorMap[config.propertyKey] = config.decorator;
  processorMap[config.prototypeKey] = config.processor;

  if (typeof config.modifier === 'function') {
    modifierArray.push(config.modifier);
  }
}

function Property(target, key, descriptor) {
  "use strict";

  var isStatic = typeof target === 'function';

  var isProperty = typeof descriptor.initializer === 'function';

  if (!isProperty) {
    throw new Error((isStatic ? 'Static' : 'Member') + ' Method [' + key + '] should not be added decorator [Component.Property] for auto-detection of vue option');
  }

  PropertyDecorator(target, key, descriptor);
}

registerProperty(require('./data'));
registerProperty(require('./props'));
registerProperty(require('./watch'));
registerProperty(require('./components'));
//# sourceMappingURL=index.js.map