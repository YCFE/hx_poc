'use strict';

exports.__esModule = true;
exports.lifeCycleHookMap = undefined;
exports.processMethodList = processMethodList;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var lifeCycleHookMap = exports.lifeCycleHookMap = {
  'beforeCreate': true,
  'created': true,
  'beforeMount': true,
  'mounted': true,
  'beforeUpdate': true,
  'updated': true,
  'beforeDestroy': true,
  'destroyed': true,
  'activated': true,
  'deactivated': true,
  'render': true
};

function filter(d) {
  return d.kind === 'method' && lifeCycleHookMap[d.key.name];
}

function processMethodList(list, visitedMap, state, path) {

  var computed = {};

  var properties = [];
  var statements = [];

  list.filter(filter).forEach(function (classMethod) {

    if (classMethod.key.name === 'render') {
      if (state.opts.noJSX) {
        throw path.hub.file.buildCodeFrameError(classMethod, 'JSX render is not supported in Component');
      }
    }

    properties.push((0, _utils.getObjectProperty)(classMethod.key.name, t.functionExpression(null, classMethod.params, classMethod.body, classMethod.generator, classMethod.async)));
  });

  return {
    properties: properties,
    statements: statements
  };
}