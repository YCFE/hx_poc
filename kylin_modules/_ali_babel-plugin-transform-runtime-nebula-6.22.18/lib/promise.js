'use strict';

exports.__esModule = true;
exports.exitPromiseVisitor = undefined;
exports.addPromiseHelper = addPromiseHelper;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var buildPromiseRequireFunc = (0, _babelTemplate2.default)('\n(function promiseRequire() {\n  if ($1) return $1;\n  if ( (typeof window !== \'undefined\') && window.Promise && typeof window.Promise.resolve === \'function\' ) {\n    $1 = window.Promise;\n  } else {\n    $1 = (require($0).default || require($0));\n  }\n  return $1;\n})\n');

var exitPromiseVisitor = exports.exitPromiseVisitor = {
  ReferencedIdentifier: function ReferencedIdentifier(path, state) {
    var node = path.node,
        parent = path.parent,
        scope = path.scope,
        hub = path.hub;


    if (t.isMemberExpression(parent)) return;
    if (scope.getBindingIdentifier(node.name)) return;

    if (state.opts.preferExternalPromise && node.name == 'Promise') {

      path.replaceWith(addPromiseHelper({
        file: path.hub.file,
        promise: 'babel-runtime/core-js/promise'
      }));
    } else if (node.name === 'Promise') {
      var ref = state.addImport('babel-runtime/core-js/promise', "default", node.name);

      path.replaceWith(ref);
    }
  },

  MemberExpression: {
    exit: function exit(path, state) {
      if (!path.isReferenced()) return;

      var node = path.node;

      var obj = node.object;

      if (path.scope.getBindingIdentifier(obj.name)) return;

      if (state.opts.preferExternalPromise && obj.name === 'Promise') {

        path.replaceWith(t.memberExpression(addPromiseHelper({
          file: path.hub.file,
          promise: 'babel-runtime/core-js/promise'
        }), node.property, node.computed));
      } else if (obj.name === 'Promise') {
        var ref = state.addImport('babel-runtime/core-js/promise', "default", obj.name);
        path.replaceWith(t.memberExpression(ref, node.property, node.computed));
      }
    }
  }
};

function addPromiseHelper(_ref) {
  var file = _ref.file,
      promise = _ref.promise;

  var promiseRequireString = t.stringLiteral(promise);
  var path = file.path,
      state = file.state;

  file.nebulaMeta = file.nebulaMeta || {};

  if (file.nebulaMeta.promiseHelperId) {
    return file.nebulaMeta.promiseHelperId;
  }

  var uid_generator = path.scope.generateUidIdentifier('ExternalPromise');
  var uid_promise = path.scope.generateUidIdentifier('ExternalPromiseCached');

  var funcExp = buildPromiseRequireFunc(promiseRequireString, uid_promise).expression;

  funcExp.id = uid_generator;
  funcExp.type = 'FunctionDeclaration';
  funcExp._nebula_promise = true;
  funcExp.body._compact = true;

  path.unshiftContainer("body", funcExp);
  path.unshiftContainer("body", t.variableDeclaration("var", [t.variableDeclarator(uid_promise)]));

  file.nebulaMeta.promiseHelperId = t.CallExpression(uid_generator, []);
  return file.nebulaMeta.promiseHelperId;
}