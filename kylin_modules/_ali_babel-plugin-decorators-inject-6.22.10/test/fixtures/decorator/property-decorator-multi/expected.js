'use strict';

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _init, _descriptor, _init2, _descriptor2, _class3, _temp;

var _decorators = require('../../../common/decorators');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

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

function FakeDec() {}
function FakeDec2() {}

let B = (_dec = _decorators.Component.Property, _dec2 = _decorators.Component.Property, _dec3 = _decorators.Component.Property, _dec4 = _decorators.Component.Property, (0, _decorators.Component)(_class = (_class2 = (_temp = _class3 = class B {
  constructor() {
    _initDefineProp(this, 'b', _descriptor, this);

    _initDefineProp(this, 'd', _descriptor2, this);
  }

}, _class3.a = 1, _class3.c = 1, _temp), (_applyDecoratedDescriptor(_class2, 'a', [_dec, FakeDec, FakeDec2], (_init = Object.getOwnPropertyDescriptor(_class2, 'a'), _init = _init ? _init.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function () {
    return _init;
  }
}), _class2), _descriptor = _applyDecoratedDescriptor(_class2.prototype, 'b', [_dec2, FakeDec, FakeDec2], {
  enumerable: true,
  initializer: function () {
    return 2;
  }
}), _applyDecoratedDescriptor(_class2, 'c', [_dec3, FakeDec], (_init2 = Object.getOwnPropertyDescriptor(_class2, 'c'), _init2 = _init2 ? _init2.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function () {
    return _init2;
  }
}), _class2), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'd', [_dec4, FakeDec], {
  enumerable: true,
  initializer: function () {
    return 2;
  }
})), _class2)) || _class);