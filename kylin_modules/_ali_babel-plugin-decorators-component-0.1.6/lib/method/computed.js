'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.processMethodList = processMethodList;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _utils = require('../utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filter(d) {
  return d.kind === 'get' || d.kind === 'set';
}

var buildComponentMethodGetSetBuilderComputed = (0, _babelTemplate2.default)('\n  component.computed = component.computed || {};\n');

var buildComponentMethodGetSetBuilderComputedKey = (0, _babelTemplate2.default)('\n  component.computed[$0] = component.computed[$0] || {};\n');

var buildComponentMethodGetSetBuilderComputedBoth = (0, _babelTemplate2.default)('\n  component.computed[$0] = {\n    get: $1,\n    set: $2\n  };\n');

function processMethodList(list, visitedMap) {

  var computed = {};

  var properties = [];
  var statements = [];

  list.filter(filter).forEach(function (classMethod) {

    var key = classMethod.key.name;
    computed[key] = computed[key] || {};
    computed[key][classMethod.kind] = t.functionExpression(null, classMethod.params, classMethod.body);
  });

  if ((0, _keys2.default)(computed).length) {
    if (!visitedMap['computed']) {

      properties = generatePropertys(computed);
    } else {

      statements = generateStatements(computed);
    }
  }

  return {
    properties: properties,
    statements: statements
  };
}

function generatePropertys(computed) {
  var computedProperties = [];
  (0, _keys2.default)(computed).forEach(function (k) {

    computedProperties.push((0, _utils.getObjectProperty)(k, t.objectExpression([computed[k].set ? (0, _utils.getObjectProperty)('set', computed[k].set) : null, computed[k].get ? (0, _utils.getObjectProperty)('get', computed[k].get) : null].filter(Boolean))));
  });

  return [(0, _utils.getObjectProperty)('computed', t.objectExpression(computedProperties))];
}

function generateStatements(computed) {
  var statements = [];

  if ((0, _keys2.default)(computed).length) {
    statements.push(buildComponentMethodGetSetBuilderComputed());

    (0, _keys2.default)(computed).forEach(function (k) {

      statements.push(buildComponentMethodGetSetBuilderComputedKey(t.stringLiteral(k)));
      if (computed[k].get || computed[k].set) {
        statements.push(buildComponentMethodGetSetBuilderComputedBoth(t.stringLiteral(k), computed[k].get || t.identifier('null'), computed[k].set || t.identifier('null')));
      }
    });
  }

  return statements;
}