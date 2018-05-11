'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.processMethodList = processMethodList;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _lifecycle = require('./lifecycle');

var _utils = require('../utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildComponentMethodBuilderMethods = (0, _babelTemplate2.default)('\n  component.methods = component.methods || {};\n');

var buildComponentMethodBuilderMethodsKey = (0, _babelTemplate2.default)('\n  component.methods[$0] = $1;\n');

function filter(d) {
  return d.kind === 'method' && !_lifecycle.lifeCycleHookMap[d.key.name];
}

function processMethodList(list, visitedMap) {

  var methods = {};

  var properties = [];
  var statements = [];

  list.filter(filter).forEach(function (classMethod) {

    methods[classMethod.key.name] = t.functionExpression(null, classMethod.params, classMethod.body, classMethod.generator, classMethod.async);
  });

  if (!visitedMap['methods']) {

    properties = generatePropertys(methods);
  } else {

    statements = generateStatements(methods);
  }

  return {
    properties: properties,
    statements: statements
  };
}

function generatePropertys(methods) {

  var methodsProperties = [];

  (0, _keys2.default)(methods).forEach(function (k) {

    methodsProperties.push((0, _utils.getObjectProperty)(k, methods[k]));
  });

  return [(0, _utils.getObjectProperty)('methods', t.objectExpression(methodsProperties))];
}

function generateStatements(methods) {

  var statements = [];

  statements.push(buildComponentMethodBuilderMethods());

  (0, _keys2.default)(methods).forEach(function (k) {

    statements.push(buildComponentMethodBuilderMethodsKey(t.stringLiteral(k), methods[k]));
  });

  return statements;
}