'use strict';

var _dec, _class, _desc, _value, _class2, _descriptor, _dec2, _class4, _desc2, _value2, _class5, _descriptor2;

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

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

let D = (_dec = _decorators.Component.Property, (0, _decorators.Component)(_class = (_class2 = class D {
  constructor() {
    _initDefineProp(this, 'components', _descriptor, this);
  }

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'components', [_dec], {
  enumerable: true,
  initializer: function () {
    return {
      A: function lazyRequire(resolve) {
        resolve(require('./a').default || require('./a'));
      }
    };
  }
})), _class2)) || _class);
let E = (_dec2 = _decorators.Component.Property, (0, _decorators.Component)(_class4 = (_class5 = class E {
  constructor() {
    _initDefineProp(this, 'components', _descriptor2, this);
  }

}, (_descriptor2 = _applyDecoratedDescriptor(_class5.prototype, 'components', [_dec2], {
  enumerable: true,
  initializer: function () {
    return {
      A: function lazyRequire(resolve) {
        resolve(require('./a').default || require('./a'));
      }
    };
  }
})), _class5)) || _class4);