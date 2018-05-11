'use strict';

exports.__esModule = true;

exports.default = function (_ref) {
  var messages = _ref.messages,
      template = _ref.template,
      t = _ref.types;


  return {
    inherits: require("babel-plugin-syntax-decorators"),
    pre: function pre(file) {

      // 预处理一下 options
      var classDecoratorName = this.opts.className;
      var propertyDecoratorName = this.opts.propertyName;
      var watchName = this.opts.watchName;
      var objectName = this.opts.objectName;
      var strict = this.opts.strict;
      var noJSX = this.opts.noJSX;

      this.opts = {
        className: classDecoratorName || 'Component',
        propertyName: propertyDecoratorName || 'Property',
        objectName: objectName || 'Object',
        watchName: watchName || 'Watch',
        strict: typeof strict === 'undefined' ? false : !!strict,
        noJSX: !!noJSX
      };
    },

    visitor: {
      Program: {},
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
        // 转发 Export Default ClassDeclaration 到 ClassExpression 中统一处理
        if (!path.get("declaration").isClassDeclaration()) return;

        var node = path.node;

        var ref = node.declaration.id || path.scope.generateUidIdentifier("default");
        node.declaration.id = ref;

        // Split the class declaration and the export into two separate statements.
        path.replaceWith(node.declaration);
        path.insertAfter(t.exportNamedDeclaration(null, [t.exportSpecifier(ref, t.identifier('default'))]));
      },
      ClassDeclaration: function ClassDeclaration(path, state) {
        // 转发 ClassDeclaration 到 ClassExpression 中统一处理

        var node = path.node;

        // 新建一个引用, 优先用class的变量名 匿名的话创建一个

        var ref = node.id || path.scope.generateUidIdentifier("class");

        // 把declaration改写成let id = expression
        var letBlock = t.variableDeclaration("let", [t.variableDeclarator(ref, t.toExpression(node))]);

        path.replaceWith(letBlock);
      },
      ClassExpression: function ClassExpression(path, state) {
        var _state$opts = state.opts,
            className = _state$opts.className,
            propertyName = _state$opts.propertyName;

        // 1. 检测 class 级别 decorator

        var node = path.node;

        // 2. 如果是null，那是 decorator-legacy 处理完了，return
        //    如果是undefined，那是没有装饰器

        if (node.decorators === undefined || node.decorators === null) {
          return;
        }

        // 开始处理带有 decorator的component
        var decorators = node.decorators;
        if (!Array.isArray(decorators)) {
          throw path.buildCodeFrameError('unsupportet decorators format, should be Array');
        }

        // 提取出decorator的名称数组
        var decoratorNames = decorators.map(function (decorator) {
          return t.isIdentifier(decorator.expression) ? decorator.expression.name : t.isCallExpression(decorator.expression) && t.isIdentifier(decorator.expression.callee) ? decorator.expression.callee.name : null;
        }).filter(Boolean);

        // 开始匹配条件
        // 如果 装饰器中有 @Component ，并且有其他装饰器，则直接报语法错误
        if (decoratorNames.filter(function (d) {
          return d === className;
        }).length === 1) {
          if (decoratorNames.length === 1) {

            // 这里开始处理
            var newBlock = (0, _componentBuilder.ComponentObjectBuilder)(path, state);
            if (newBlock) {
              path.replaceWith(newBlock);
            }
            // 在处理各个属性的时候，还要再处理一下
          } else {
            // 如果存在其他 className 的装饰器
            throw path.buildCodeFrameError('@' + className + ' decorator should not be used with other decorators [' + decoratorNames.filter(function (d) {
              return d !== className;
            }) + ']');
          }
        }
      }
    }
  };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _componentBuilder = require('./component-builder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];