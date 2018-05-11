'use strict';

exports.__esModule = true;
exports.Component = Component;
exports.ObjectFunc = ObjectFunc;

var _component = require('./component.js');

var _object = require('./object.js');

function Component(classTargetOrOption) {
  "use strict";

  if (typeof classTargetOrOption === 'function') {
    return (0, _component.ComponentDecoratorGenerator)()(classTargetOrOption);
  } else {
      return (0, _component.ComponentDecoratorGenerator)(classTargetOrOption);
    }
}

function ObjectFunc(objectFuncOrOption) {
  "use strict";

  if (typeof objectFuncOrOption === 'function') {
    return (0, _object.ComponentObjectModifier)()(objectFuncOrOption);
  } else {
      return (0, _object.ComponentObjectModifier)(objectFuncOrOption);
    }
}
//# sourceMappingURL=index.js.map