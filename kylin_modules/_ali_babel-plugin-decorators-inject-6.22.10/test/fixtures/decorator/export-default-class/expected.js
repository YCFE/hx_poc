'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _class, _temp, _dec, _dec2, _class2, _desc, _value, _class3, _init, _descriptor, _class4, _temp2;

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

function assert(b) {
  if (!b) throw new Error(b);
}

function Component(cls) {
  assert(cls.name === 'B');
  console.log('Component', cls.name);
}
const map = Object.create(null);
function Property(target, key, desc) {
  map[key] = map[key] || 0;
  map[key]++;

  assert(map[key] <= 1);

  console.log('Property', key);
}

Component.Property = Property;

let A = exports.A = (_temp = _class = class A {
  constructor() {
    this.b = 2;
  }

  static c() {}
  d() {}
}, _class.a = 1, _temp);
let B = exports.B = (_dec = Component.Property, _dec2 = Component.Property, Component(_class2 = (_class3 = (_temp2 = _class4 = class B {
  constructor() {
    _initDefineProp(this, 'b', _descriptor, this);
  }

  static c() {}
  d() {}
}, _class4.a = 1, _temp2), (_applyDecoratedDescriptor(_class3, 'a', [_dec], (_init = Object.getOwnPropertyDescriptor(_class3, 'a'), _init = _init ? _init.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function () {
    return _init;
  }
}), _class3), _descriptor = _applyDecoratedDescriptor(_class3.prototype, 'b', [_dec2], {
  enumerable: true,
  initializer: function () {
    return 2;
  }
})), _class3)) || _class2);