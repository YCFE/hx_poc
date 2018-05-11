'use strict';

var _class, _temp, _class2, _class3, _temp2, _dec, _dec2, _class4, _desc, _value, _class5, _init, _descriptor, _class6, _temp3, _dec3, _dec4, _class7, _desc2, _value2, _class8, _init2, _descriptor2, _class9, _temp4;

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

let A = (_temp = _class = class A {
  constructor() {
    this.b = 2;
  }

  static c() {}
  d() {}
}, _class.a = 1, _temp);

let B = FakeDec(_class2 = (_temp2 = _class3 = class B {
  constructor() {
    this.b = 2;
  }

  static c() {}
  d() {}
}, _class3.a = 1, _temp2)) || _class2;

let C = (_dec = _decorators.Component.Property, _dec2 = _decorators.Component.Property, (0, _decorators.Component)(_class4 = FakeDec(_class4 = (_class5 = (_temp3 = _class6 = class C {
  constructor() {
    _initDefineProp(this, 'b', _descriptor, this);
  }

  static c() {}
  d() {}
}, _class6.a = 1, _temp3), (_applyDecoratedDescriptor(_class5, 'a', [_dec], (_init = Object.getOwnPropertyDescriptor(_class5, 'a'), _init = _init ? _init.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function () {
    return _init;
  }
}), _class5), _descriptor = _applyDecoratedDescriptor(_class5.prototype, 'b', [_dec2], {
  enumerable: true,
  initializer: function () {
    return 2;
  }
})), _class5)) || _class4) || _class4);
let D = (_dec3 = _decorators.Component.Property, _dec4 = _decorators.Component.Property, FakeDec(_class7 = (0, _decorators.Component)(_class7 = (_class8 = (_temp4 = _class9 = class D {
  constructor() {
    _initDefineProp(this, 'b', _descriptor2, this);
  }

  static c() {}
  d() {}
}, _class9.a = 1, _temp4), (_applyDecoratedDescriptor(_class8, 'a', [_dec3], (_init2 = Object.getOwnPropertyDescriptor(_class8, 'a'), _init2 = _init2 ? _init2.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function () {
    return _init2;
  }
}), _class8), _descriptor2 = _applyDecoratedDescriptor(_class8.prototype, 'b', [_dec4], {
  enumerable: true,
  initializer: function () {
    return 2;
  }
})), _class8)) || _class7) || _class7);