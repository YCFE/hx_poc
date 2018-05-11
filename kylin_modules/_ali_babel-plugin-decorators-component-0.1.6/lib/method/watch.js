'use strict';

exports.__esModule = true;
exports.processMethodList = processMethodList;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _lifecycle = require('./lifecycle');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var buildComponentWatchBuilder = (0, _babelTemplate2.default)('\n  component.watch = component.watch || {};\n');

var buildComponentWatchOptionBuilder = (0, _babelTemplate2.default)('\n  {\n    component.watch[$0] = $1 || {};\n    component.watch[$0][\'handler\'] = $2;\n  }\n');

function filter(d) {
  return d.kind === 'method' && !_lifecycle.lifeCycleHookMap[d.key.name];
}

function getWatchDecoratorsLength(decorators, state) {
  var watchName = state.opts.watchName;


  if (!decorators) return 0;

  var matchDecorators = decorators.filter(function (d) {
    return t.isCallExpression(d.expression) && t.isIdentifier(d.expression.callee) && d.expression.callee.name === watchName;
  });

  return matchDecorators.length;
}

function processMethodList(list, visitedMap, state, path) {
  var watchName = state.opts.watchName;


  var watch = [];

  var properties = [];
  var statements = [];

  list.filter(filter).forEach(function (classMethod) {

    var decorators = classMethod.decorators;
    var watchDecoratorsLength = getWatchDecoratorsLength(decorators, state);

    // 如果有Watch 且全是watch
    if (watchDecoratorsLength >= 1 && watchDecoratorsLength === decorators.length) {

      decorators.forEach(function (decorator) {

        var args = decorator.expression.arguments;
        var watchOption = args[1] || t.objectExpression([]);

        watch.push({
          key: args[0],
          option: watchOption,
          handler: classMethod.key.name
        });
      });
    } else if (decorators && decorators.length > 0) {
      var names = decorators.map(function (d) {
        return d.expression.name || d.expression.callee && d.expression.callee.name;
      }).filter(Boolean);
      // 如果有别的装饰器，报错
      throw path.hub.file.buildCodeFrameError(classMethod, '@' + watchName + ' decorator should not be used with other decorators [' + names.filter(function (d) {
        return d !== watchName;
      }) + ']');
    }
  });

  if (watch.length) {

    statements = generateStatements(watch, state, path);
  }

  return {
    properties: properties,
    statements: statements
  };
}

function generateStatements(watch, state, path) {
  var _state$opts = state.opts,
      watchName = _state$opts.watchName,
      strict = _state$opts.strict;


  var statements = [];

  statements.push(buildComponentWatchBuilder());

  watch.forEach(function (_ref) {
    var key = _ref.key,
        option = _ref.option,
        handler = _ref.handler;


    if (strict) {
      if (!t.isStringLiteral(key)) {
        throw path.hub.file.buildCodeFrameError(key, 'Watch key should be primitive string.');
      }
      if (!t.isObjectExpression(option)) {
        throw path.hub.file.buildCodeFrameError(option, 'Watch option should be primitive object.');
      }
    }
    statements.push(buildComponentWatchOptionBuilder(key, option, t.stringLiteral(handler)));
  });

  return statements;
}