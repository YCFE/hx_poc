'use strict';

exports.__esModule = true;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

exports.default = function (_ref) {
  var messages = _ref.messages,
      template = _ref.template,
      t = _ref.types;


  var ReassignmentVisitor = {
    ReferencedIdentifier: function ReferencedIdentifier(path, state) {
      var imports = state.imports,
          refIds = state.refIds,
          scope = state.scope;
      var node = path.node;

      var name = node.name;
      var remap = imports[name];
      if (!remap) return;
      if (scope.getBinding(name) !== path.scope.getBinding(name)) return;

      refIds[name] = refIds[name] || {};

      if (node.__lazy_identifier__) {
        refIds[name].lazy = refIds[name].lazy || 0;
        refIds[name].lazy++;
      } else {
        refIds[name].ref = refIds[name].ref || 0;
        refIds[name].ref++;
      }
    },
    AssignmentExpression: function AssignmentExpression(path, state) {},
    UpdateExpression: function UpdateExpression(path, state) {}
  };

  var ComponentPropertyVisitor = {
    ObjectExpression: function ObjectExpression(path, state) {
      var refIds = state.refIds;
      var node = path.node;


      if (node.__should_lazyrequire__) {

        var lazyMap = state.imports;

        node.properties.forEach(function (property, index) {
          if (!t.isIdentifier(property.value)) return;

          var userIdentifier = property.value;
          var name = userIdentifier.name;

          if (!lazyMap[name]) return;

          var importData = lazyMap[name];

          if (importData.scope.getBinding(name) !== path.scope.getBinding(name)) return;

          if (refIds[name]) {
            if (refIds[name].ref) return;
          }

          var lazyExpression = buildLazyRequire(t.stringLiteral(importData.sourceValue));

          property.value = lazyExpression;

          if (importData.path.removed) return;
          importData.path.remove();
        });
      }
    }
  };

  function onlyHaveDefaultSpecifier(specifiers) {
    if (!specifiers) return false;
    if (specifiers.length !== 1) return false;

    return t.isImportDefaultSpecifier(specifiers[0]);
  }

  function isSourcePath(source) {
    if (!source) return false;
    return t.isStringLiteral(source);
  }

  function hasInjectManual(decorator, path, state) {
    var _state$opts = state.opts,
        className = _state$opts.className,
        propertyName = _state$opts.propertyName,
        propertyIgnoreName = _state$opts.propertyIgnoreName;


    var ret = decorator.expression.name === propertyIgnoreName || t.isMemberExpression(decorator.expression) && decorator.expression.object.name === className && decorator.expression.property.name === propertyName;
    return ret;
  }

  function injectComponentName(path, state) {
    var injectComponentName = state.opts.injectComponentName;

    if (!injectComponentName) return;

    var list = path.node.body.body;
    var classExp = path.node;
    var hasNameProperty = false;
    var hasNonKeyItem = false;
    var hasNameMethod = false;

    var className = classExp.id && classExp.id.name;

    if (!className) return;

    list.forEach(function (propertyOrMethod) {

      if (!t.isIdentifier(propertyOrMethod.key) || hasNonKeyItem) {
        hasNonKeyItem = true;

        return;
      }

      if (t.isClassProperty(propertyOrMethod)) {
        if (propertyOrMethod.key.name === 'name') {
          hasNameProperty = true;
        }
      } else if (t.isClassMethod(propertyOrMethod)) {
        if (propertyOrMethod.key.name === 'name') {
          hasNameMethod = true;
        }
      }
    });

    if (!hasNameMethod && !hasNameProperty) {
      var newProperty = t.ClassProperty(t.Identifier("name"), t.StringLiteral(className), undefined, [], false);
      newProperty.static = false;
      list.unshift(newProperty);
    }
  }

  function componentLazyRequireRecognize(path, state) {

    var list = path.node.body.body;

    var _state$opts2 = state.opts,
        componentsPropertyName = _state$opts2.componentsPropertyName,
        enableComponentLazyRequire = _state$opts2.enableComponentLazyRequire;


    if (!enableComponentLazyRequire) return;

    list.forEach(function (propertyOrMethod) {
      if (!t.isClassProperty(propertyOrMethod) || propertyOrMethod.static) return;

      if (!t.isIdentifier(propertyOrMethod.key)) return;

      if (propertyOrMethod.key.name !== componentsPropertyName) return;

      if (!t.isObjectExpression(propertyOrMethod.value)) return;

      propertyOrMethod.value.__should_lazyrequire__ = true;

      propertyOrMethod.value.properties.forEach(function (property, index) {
        if (!t.isIdentifier(property.value)) return;

        property.value.__lazy_identifier__ = true;
      });
    });
  }

  function prependTargetDecorator(path, state) {

    var list = path.node.body.body;

    var _state$opts3 = state.opts,
        className = _state$opts3.className,
        propertyName = _state$opts3.propertyName,
        propertyIgnoreName = _state$opts3.propertyIgnoreName;


    list.forEach(function (propertyOrMtehod) {

      if (!t.isClassProperty(propertyOrMtehod)) return;

      if (propertyOrMtehod.decorators === null) return;

      propertyOrMtehod.decorators = propertyOrMtehod.decorators || [];

      var matchDecorators = propertyOrMtehod.decorators.filter(function (decorator) {
        return hasInjectManual(decorator, path, state);
      });

      if (matchDecorators.length > 0) return;

      var insertDecorator = t.Decorator(t.MemberExpression(t.Identifier('' + className), t.Identifier('' + propertyName)));

      propertyOrMtehod.decorators.unshift(insertDecorator);
    });
  }

  function injectRenderParameterH(path, state) {
    var enableRenderInjectH = state.opts.enableRenderInjectH;


    if (!enableRenderInjectH) return;

    var list = path.node.body.body;

    list.forEach(function (propertyOrMtehod) {
      if (!t.isClassMethod(propertyOrMtehod)) return;

      if (!t.isIdentifier(propertyOrMtehod.key) || propertyOrMtehod.key.name !== 'render') return;

      propertyOrMtehod.__should_inject_create_element__ = true;
    });

    path.traverse({
      ClassMethod: function ClassMethod(path, state) {
        var node = path.node;

        if (node.__should_inject_create_element__ !== true) return;

        if (path.scope.getOwnBinding('h')) return;

        if (node.params && node.params.length > 0) return;

        node.params = node.params || [];

        node.params.push(t.Identifier('h'));
      }
    }, {});
  }

  return {
    inherits: require("babel-plugin-syntax-decorators"),
    pre: function pre(file) {
      var classDecoratorName = this.opts.className;
      var propertyDecoratorName = this.opts.propertyName;
      var ignorePropertyDecoratorName = this.opts.propertyIgnoreName;
      var componentsPropertyName = this.opts.componentsPropertyName;
      var enableComponentLazyRequire = this.opts.enableComponentLazyRequire;
      var enableRenderInjectH = this.opts.enableRenderInjectH;
      var injectComponentName = this.opts.injectComponentName;

      this.opts = {
        className: classDecoratorName || 'Component',
        propertyName: propertyDecoratorName || 'Property',
        propertyIgnoreName: ignorePropertyDecoratorName || propertyDecoratorName || 'Property',
        componentsPropertyName: componentsPropertyName || 'components',
        enableComponentLazyRequire: enableComponentLazyRequire === undefined ? false : enableComponentLazyRequire,
        enableRenderInjectH: enableRenderInjectH === undefined ? false : enableRenderInjectH,
        injectComponentName: injectComponentName === undefined ? false : injectComponentName
      };
    },


    visitor: {
      Program: {
        exit: function exit(path, state) {

          var body = path.get("body");
          var imports = (0, _create2.default)(null);

          for (var _iterator = body, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
            var _ref2;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref2 = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref2 = _i.value;
            }

            var _path = _ref2;


            if (_path.isImportDeclaration()) {
              var node = _path.node;
              var specifiers = node.specifiers,
                  source = node.source;

              if (onlyHaveDefaultSpecifier(specifiers) && isSourcePath(source)) {

                var specifier = specifiers[0];
                var importIdentifier = specifier.local;

                if (!t.isIdentifier(importIdentifier)) return;

                var identifierName = importIdentifier.name;
                var sourceValue = source.value;


                imports[identifierName] = {
                  sourceValue: sourceValue,
                  path: _path,
                  scope: _path.scope,
                  processed: false
                };
              }
            }
          }

          var refIds = {};
          path.traverse(ReassignmentVisitor, {
            imports: imports,
            refIds: refIds,
            scope: path.scope
          });

          path.traverse(ComponentPropertyVisitor, {
            imports: imports,
            refIds: refIds
          });
        }
      },
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
        if (!path.get("declaration").isClassDeclaration()) return;

        var node = path.node;

        var ref = node.declaration.id || path.scope.generateUidIdentifier("default");
        node.declaration.id = ref;

        path.replaceWith(node.declaration);
        path.insertAfter(t.exportNamedDeclaration(null, [t.exportSpecifier(ref, t.identifier('default'))]));
      },
      ClassDeclaration: function ClassDeclaration(path, state) {
        var node = path.node;

        var ref = node.id || path.scope.generateUidIdentifier("class");

        var letBlock = t.variableDeclaration("let", [t.variableDeclarator(ref, t.toExpression(node))]);

        path.replaceWith(letBlock);
      },
      ClassExpression: function ClassExpression(path, state) {
        var _state$opts4 = state.opts,
            className = _state$opts4.className,
            propertyName = _state$opts4.propertyName;
        var node = path.node;

        if (path.node._add_decorator_ === true) return;
        path.node._add_decorator_ = true;

        if (node.decorators === undefined || node.decorators === null) {
          return;
        }

        var decorators = node.decorators;
        if (!Array.isArray(decorators)) {
          throw path.buildCodeFrameError('unsupportet decorators format, should be Array');
        }

        var matchDecorators = decorators.filter(function (decorator) {
          return t.isIdentifier(decorator.expression) && decorator.expression.name === className || t.isCallExpression(decorator.expression) && t.isIdentifier(decorator.expression.callee) && decorator.expression.callee.name === className;
        });

        if (matchDecorators.length === 1) {
          injectComponentName(path, state);

          prependTargetDecorator(path, state);

          componentLazyRequireRecognize(path, state);
        }
      }
    }
  };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildLazyRequire = (0, _babelTemplate2.default)('\n  function lazyRequire(resolve) {\n    resolve(require($0).default || require($0));\n  }\n');

module.exports = exports['default'];