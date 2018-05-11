'use strict';

var _dec, _class, _desc, _value, _class2, _init, _class3, _temp;

var _decorators = require('../../../common/decorators');

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

let B = (_dec = _decorators.Component.Property, (0, _decorators.Component)(_class = (_class2 = (_temp = _class3 = class B {
  a() {}
}, _class3.name = 'c', _temp), (_applyDecoratedDescriptor(_class2, 'name', [_dec], (_init = Object.getOwnPropertyDescriptor(_class2, 'name'), _init = _init ? _init.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function () {
    return _init;
  }
}), _class2)), _class2)) || _class);