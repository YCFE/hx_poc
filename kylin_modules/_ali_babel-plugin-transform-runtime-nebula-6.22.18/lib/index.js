'use strict';

exports.__esModule = true;
exports.definitions = undefined;

exports.default = function (_ref) {
  var messages = _ref.messages,
      template = _ref.template,
      t = _ref.types;


  function getDefinition(opts) {
    return (0, _definitions2.default)(opts && opts.nebulaTarget);
  }

  function getRuntimeModuleName(opts) {
    return opts.moduleName || "babel-runtime";
  }

  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  var HELPER_BLACKLIST = ["interopRequireWildcard", "interopRequireDefault"];

  return {
    pre: function pre(file) {
      var moduleName = getRuntimeModuleName(this.opts);

      if (this.opts.helpers !== false) {
        file.set("helperGenerator", function (name) {
          if (HELPER_BLACKLIST.indexOf(name) < 0) {
            return file.addImport(moduleName + '/helpers/' + name, "default", name);
          }
        });
      }

      this.setDynamic("regeneratorIdentifier", function () {
        return file.addImport(moduleName + '/regenerator', "default", "regeneratorRuntime");
      });
    },


    visitor: {
      ForOfStatement: (0, _forOf.factory)({ messages: messages, template: template, types: t }),
      Program: {
        exit: function exit(path, state) {
          if (state.opts.requeue !== false) {
            if (!this.requeued) {
              path.requeue();
              this.requeued = true;
            }
          }

          if (state.opts.ensureExitPromise) {
            path.traverse(_promise.exitPromiseVisitor, state);
          }
        }
      },
      ReferencedIdentifier: function ReferencedIdentifier(path, state) {
        var node = path.node,
            parent = path.parent,
            scope = path.scope;


        if (node.name === "regeneratorRuntime" && state.opts.regenerator !== false) {
          path.replaceWith(state.get("regeneratorIdentifier"));
          return;
        }

        if (state.opts.polyfill === false) return;

        if (t.isMemberExpression(parent)) return;
        if (!has(getDefinition(state.opts).builtins, node.name)) return;
        if (scope.getBindingIdentifier(node.name)) return;

        var moduleName = getRuntimeModuleName(state.opts);


        if (state.opts.preferExternalPromise && node.name === 'Promise') {

          path.replaceWith((0, _promise.addPromiseHelper)({
            file: path.hub.file,
            promise: moduleName + '/core-js/' + getDefinition(state.opts).builtins[node.name]
          }));
        } else {
          path.replaceWith(state.addImport(moduleName + '/core-js/' + getDefinition(state.opts).builtins[node.name], "default", node.name));
        }
      },
      CallExpression: function CallExpression(path, state) {
        if (state.opts.polyfill === false) return;

        if (path.node.arguments.length) return;

        var callee = path.node.callee;
        if (!t.isMemberExpression(callee)) return;
        if (!callee.computed) return;
        if (!path.get("callee.property").matchesPattern("Symbol.iterator")) return;

        var moduleName = getRuntimeModuleName(state.opts);
        path.replaceWith(t.callExpression(state.addImport(moduleName + '/core-js/get-iterator', "default", "getIterator"), [callee.object]));
      },
      BinaryExpression: function BinaryExpression(path, state) {
        if (state.opts.polyfill === false) return;

        if (path.node.operator !== "in") return;
        if (!path.get("left").matchesPattern("Symbol.iterator")) return;

        var moduleName = getRuntimeModuleName(state.opts);
        path.replaceWith(t.callExpression(state.addImport(moduleName + '/core-js/is-iterable', "default", "isIterable"), [path.node.right]));
      },

      MemberExpression: {
        enter: function enter(path, state) {
          if (state.opts.polyfill === false) return;
          if (!path.isReferenced()) return;

          var node = path.node;

          var obj = node.object;
          var prop = node.property;

          if (!t.isReferenced(obj, node)) return;
          if (node.computed) return;
          if (!has(getDefinition(state.opts).methods, obj.name)) return;

          var methods = getDefinition(state.opts).methods[obj.name];
          if (!has(methods, prop.name)) return;

          if (path.scope.getBindingIdentifier(obj.name)) return;

          if (obj.name === "Object" && prop.name === "defineProperty" && path.parentPath.isCallExpression()) {
            var call = path.parentPath.node;
            if (call.arguments.length === 3 && t.isLiteral(call.arguments[1])) return;
          }

          var moduleName = getRuntimeModuleName(state.opts);
          if (_runtime2.default[methods[prop.name]] && state.opts.loosePolyfill) {
            var runtimePath = require.resolve(__dirname + '/runtime/' + methods[prop.name]);
            path.replaceWith(state.addImport(runtimePath, "default", obj.name + '$' + prop.name));
          } else {
            path.replaceWith(state.addImport(moduleName + '/core-js/' + methods[prop.name], "default", obj.name + '$' + prop.name));
          }
        },
        exit: function exit(path, state) {
          if (state.opts.polyfill === false) return;
          if (!path.isReferenced()) return;

          var node = path.node;

          var obj = node.object;

          if (!has(getDefinition(state.opts).builtins, obj.name)) return;
          if (path.scope.getBindingIdentifier(obj.name)) return;

          var moduleName = getRuntimeModuleName(state.opts);

          if (state.opts.preferExternalPromise && obj.name === 'Promise') {
            path.replaceWith(t.memberExpression((0, _promise.addPromiseHelper)({
              file: path.hub.file,
              promise: moduleName + '/core-js/' + getDefinition(state.opts).builtins[obj.name]
            }), node.property, node.computed));
          } else {
            path.replaceWith(t.memberExpression(state.addImport(moduleName + '/core-js/' + getDefinition(state.opts).builtins[obj.name], "default", obj.name), node.property, node.computed));
          }
        }
      }
    }
  };
};

var _definitions = require('./definitions');

var _definitions2 = _interopRequireDefault(_definitions);

var _forOf = require('./for-of');

var _promise = require('./promise');

var _runtime = require('./runtime');

var _runtime2 = _interopRequireDefault(_runtime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.definitions = _definitions2.default;