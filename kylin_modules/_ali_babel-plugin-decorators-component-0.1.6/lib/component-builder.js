'use strict';

exports.__esModule = true;
exports.ComponentObjectBuilder = ComponentObjectBuilder;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _property = require('./property');

var _method = require('./method');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var buildComponentObjectBuilder = (0, _babelTemplate2.default)('\n  (function ComponentBuilder() {\n    const component = $0;\n\n    ;$1;\n\n    return component;\n  })\n');

var buildComponentObjectCallerBuilder = (0, _babelTemplate2.default)('\n  $0.$1($2)($3)\n');

function ComponentObjectBuilder(path, state) {
  var _state$opts = state.opts,
      className = _state$opts.className,
      propertyName = _state$opts.propertyName,
      objectName = _state$opts.objectName,
      strict = _state$opts.strict;

  var _classPropertyMethodV = classPropertyMethodValidCheck(path, path.node.body.body, state),
      valid = _classPropertyMethodV.valid,
      list = _classPropertyMethodV.list;

  if (valid) {

    var propertyList = list.filter(function (d) {
      return d.type === 'ClassProperty';
    });
    var methodList = list.filter(function (d) {
      return d.type === 'ClassMethod';
    });

    // 拿到用户直接赋值了哪些key， 并且应该做什么处理

    var _processPropertyList = (0, _property.processPropertyList)(propertyList, state, path),
        objectExpressionArrayProperty = _processPropertyList.properties,
        propertyKeyMap = _processPropertyList.propertyKeyMap;

    // 获取method


    var _processMethodList = (0, _method.processMethodList)(methodList, state, propertyKeyMap, path),
        objectExpressionArrayMethod = _processMethodList.properties,
        statementExpressionArray = _processMethodList.statements;

    var properties = [].concat(objectExpressionArrayProperty).concat(objectExpressionArrayMethod);

    var componentInfo = buildComponentObjectBuilder(t.objectExpression(properties), statementExpressionArray);

    // classNode
    var node = path.node;

    // 保证有且只有一个装饰器 @Component 的情况下，考虑替换实现
    // 期望替换成
    /**
     * 
     * Component.Object(connectOption)(objectGenerator);
     * 
     */

    var ComponentDecorator = node.decorators[0];
    var connectArgs = [t.objectExpression([])];

    if (t.isCallExpression(ComponentDecorator.expression)) {
      // 带connectOption
      connectArgs = ComponentDecorator.expression.arguments;
    }

    return buildComponentObjectCallerBuilder(t.identifier(className), t.identifier(objectName), connectArgs, componentInfo.expression);
  }
}

function classPropertyMethodValidCheck(path, list, state) {
  var _state$opts2 = state.opts,
      className = _state$opts2.className,
      propertyName = _state$opts2.propertyName,
      objectName = _state$opts2.objectName,
      strict = _state$opts2.strict;


  var ret = true;
  list.forEach(function (classPropertyOrMethod) {
    if (!t.isIdentifier(classPropertyOrMethod.key)) {
      // TODO 打出警告，非id类，比如字符串计算key，后续babel会翻译报错
      ret = false;
      throw path.hub.file.buildCodeFrameError(classPropertyOrMethod, '[' + (classPropertyOrMethod.key && (classPropertyOrMethod.key.name || classPropertyOrMethod.key.value)) + '] non-identifier key is not supported');
    }
    if (classPropertyOrMethod.static ||
    // support async method
    // classPropertyOrMethod.async ||
    classPropertyOrMethod.generator) {
      // TODO 打出警告，该key会被直接过滤掉
      // debugger

      if (strict) {
        ret = false;
        var c = classPropertyOrMethod;
        var errorType = c.static ? 'static' : c.async ? 'async' : 'generator';
        throw path.hub.file.buildCodeFrameError(classPropertyOrMethod, '\'' + errorType + '\' ' + classPropertyOrMethod.type + ' [' + (classPropertyOrMethod.key && (classPropertyOrMethod.key.name || classPropertyOrMethod.key.value)) + '] is not supported.');
      }
    }
  });

  list = list.filter(function (d) {
    return !d.static && !d.generator && t.isIdentifier(d.key);
  });

  return {
    list: list,
    valid: ret
  };
}