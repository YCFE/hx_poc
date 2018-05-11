'use strict';

exports.__esModule = true;
exports.processProperty = processProperty;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var buildComponentPropertyDataBuilder = (0, _babelTemplate2.default)('\n  (function () {\n    return $0;\n  })\n');

function processProperty(classProperty, state) {
  var ret = void 0;
  var len = (0, _utils.validPropertyDecoratorLength)(classProperty.decorators, state);

  // 多个Property, Component.Property
  // 只放一次，
  // 必须有才放
  if (len === classProperty.decorators.length && len >= 1) {
    // 往里面塞一个
    ret = (0, _utils.getObjectProperty)('data', buildComponentPropertyDataBuilder(classProperty.value));
  } else {
    // TODO 打出警告

  }

  return ret;
}