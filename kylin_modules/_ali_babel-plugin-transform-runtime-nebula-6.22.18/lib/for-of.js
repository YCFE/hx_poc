"use strict";

exports.__esModule = true;
exports.factory = factory;
function factory(_ref) {
  var messages = _ref.messages,
      template = _ref.template,
      t = _ref.types;


  var buildForOfArray = template("\n    for (var KEY = 0; KEY < ARR.length; KEY++) BODY;\n  ");

  function _ForOfStatementArray(path) {
    var node = path.node,
        scope = path.scope;

    var nodes = [];
    var right = node.right;

    if (!t.isIdentifier(right) || !scope.hasBinding(right.name)) {
      var uid = scope.generateUidIdentifier("arr");
      nodes.push(t.variableDeclaration("var", [t.variableDeclarator(uid, right)]));
      right = uid;
    }

    var iterationKey = scope.generateUidIdentifier("i");

    var loop = buildForOfArray({
      BODY: node.body,
      KEY: iterationKey,
      ARR: right
    });

    t.inherits(loop, node);
    t.ensureBlock(loop);

    var iterationValue = t.memberExpression(right, iterationKey, true);

    var left = node.left;
    if (t.isVariableDeclaration(left)) {
      left.declarations[0].init = iterationValue;
      loop.body.body.unshift(left);
    } else {
      loop.body.body.unshift(t.expressionStatement(t.assignmentExpression("=", left, iterationValue)));
    }

    if (path.parentPath.isLabeledStatement()) {
      loop = t.labeledStatement(path.parentPath.node.label, loop);
    }

    nodes.push(loop);

    return nodes;
  }

  return function ForOfStatement(path, state) {

    var loc = path.node.loc.start;

    if (!path._nebula_for_of_visited) {
      this.file.log.warn("Found Unsupport For-Of Statement at Line " + loc.line + ", Column " + loc.column);
      path._nebula_for_of_visited = true;
    }
    if (state.opts.forOfArray === true) {
      return;
    } else {
      throw path.buildCodeFrameError("'for-of' statement is DISABLED by default considering runtime performance, \nif you use kylin project, set {\"enableForOfArray\": true} in 'package.json'.'kylinApp'.'options' for kylin project, see('http://kylin.alipay.net/kylin/cli/buildtool.html#kylinappoptions\u914D\u7F6E\u9009\u9879');\nif you use '@ali/babel-plugin-transform-runtime-nebula', set {\"forOfArray\": true} in plugin-option;\nif you use '@ali/babel-preset-es2015-nebula', set {\"enableForOfArray\": true} in preset-option;\nto ENABLE this feature. ");
    }
  };
}