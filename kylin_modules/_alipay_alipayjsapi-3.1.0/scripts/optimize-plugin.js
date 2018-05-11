var t = require('babel-types');
var template = require('babel-template');

var helperObjectFactory = template(`
function ID() {
  var arg = arguments;
  var ret = {};
  for(var i=0;i<arg.length;i+=2) {
    ret[ arg[i] ] = arg[i+1];
  }
  return ret;
}
`);

var helperDeleteFactory = template(`
function ID(obj, prop) {
  delete obj[prop];
}
`)

module.exports = function (babel) {
  var messages = babel.messages;
  var template = babel.template;
  var t = babel.types;
  return {
    pre: function (file) {

    },
    visitor: {
      Program: {
        exit(path, state) {

          // 把所有delete全转换成函数调用
          extractDeleteMemberExpression(path, state);

          // 把一个单层object映射成一个function调用
          // 33821->33674提升不明显
          // replaceObjectToFunction(path, state);

          replaceMemberExpressionAndStringLiteral(path, state);

          // 由于uglify的reduce_funcs，不启用该功能
          // hoistObjectMethod(path, state);

        }
      }
    }
  }
}

function extractDeleteMemberExpression(path, state) {
  const scopeToHelperMap = Object.create(null);

  path.traverse({
    UnaryExpression: function (path, state) {
      const topFuncBodyPath = getTopIIFEPath(path);
      if (!topFuncBodyPath || !topFuncBodyPath.scope) return;

      // 是delete xxxx.yyyy;
      if (
        path.node.operator === 'delete' &&
        // 必须computed:false才支持
        t.isMemberExpression(path.node.argument, { computed: false }) &&
        t.isIdentifier(path.node.argument.property)
      ) {
        const helperId = getHelperFuncFromScope(topFuncBodyPath, scopeToHelperMap, helperDeleteFactory, `FUNC_delete_factory`);

        path.replaceWith(
          t.callExpression(
            helperId,
            [
              // obj
              path.node.argument.object,
              // prop
              t.StringLiteral(path.node.argument.property.name)
            ]
          )
        );
      }
    }
  }, state);
}

/**
 * 在当前path下生成一个helper函数定义，如果有了就直接返回
 * @param {NodePath} path 
 * @param {Record<string, Identifier>} scopeToHelperMap
 */
function getHelperFuncFromScope(path, scopeToHelperMap, factory, name) {
  const scope = path.scope;
  const scopeId = scope.uid;
  if (!scopeToHelperMap[scopeId]) {
    const funcUid = scope.generateUidIdentifier(name);
    scopeToHelperMap[scopeId] = funcUid;
    // 插入函数定义
    path.unshiftContainer('body',
      factory({
        ID: funcUid
      })
    );
  }
  return scopeToHelperMap[scopeId];
}

/**
 * 把当前遍历path下遇到的单层objectExpression转换成一个函数调用，有helper函数动态生成object
 * from
 * ```javascript
 * {
 *  abcdef: 1,
 *  qwert: '123'
 * }
 * ```
 * 
 * to
 * ```javascript
 * helper('abcdef',1,'qwert','123')
 * ```
 * 
 * @param {NodePath} path 
 * @param {State} state 
 */
function replaceObjectToFunction(path, state) {

  const scopeToHelperMap = Object.create(null);

  // 遍历遇到的所有objectExpression
  path.traverse({
    ObjectExpression: function (path, state) {
      const topFuncBodyPath = getTopIIFEPath(path);

      if (!topFuncBodyPath || !topFuncBodyPath.scope) return;
      // 是一个1层obj, 外层不是obj
      if (t.isObjectProperty(path.parent)) return

      // 特殊场景不处理
      const errors = path.node.properties.filter(p =>
        // 是...d
        (t.isSpreadProperty(p)) ||
        // 不是key
        (!t.isIdentifier(p.key)) ||
        // 是computed, 其实可以的但现在不考虑这个场景
        (t.isObjectProperty(p, { computed: true })) ||
        (t.isObjectMethod(p, { computed: true })) ||
        // 孩子不能有objectExpression
        (t.isObjectProperty(p) && t.isObjectExpression(p.value))
      );

      if (errors.length) return;

      // 是否有必要处理
      const valids = path.node.properties.filter(p =>
        p.key.name.length >= 4
      );
      if (valids.length < 1) return;

      // 开始转换成function
      const helperId = getHelperFuncFromScope(topFuncBodyPath, scopeToHelperMap, helperObjectFactory, `FUNC_object_factory`);
      const helperArgs = [];
      path.node.properties.forEach(p => {
        if (t.isObjectProperty(p)) {
          helperArgs.push(t.stringLiteral(p.key.name));
          helperArgs.push(p.value);
        } else if (t.isObjectMethod(p)) {
          helperArgs.push(t.stringLiteral(p.key.name));
          helperArgs.push(t.functionExpression(null, p.params, p.body, p.generator, p.async));
        }
      });
      path.replaceWith(
        t.callExpression(
          helperId,
          helperArgs
        )
      );

    }
  }, state);
}

/**
 * 将所有ObjectExpression中的FunctionExpression/ObjectMethod提升到当前所在作用域的函数定义
 * 
 * from
 * ```javascript
 * {
 *  a: function () { 1; }
 *  b() { 2; }
 * }
 * ```
 * 
 * to
 * ```javascript
 * function FUNC_a() { 1; }
 * function FUNC_b() { 2; }
 * {
 *  a: FUNC_a,
 *  b: FUNC_b
 * }
 * ```
 * 
 * @param {NodePath} path 
 * @param {State} state 
 */
function hoistObjectMethod(path, state) {
  /**
   * 获得当前path所在函数作用域path
   * @param {NodePath} path 
   */
  function getParentFunctionBody(path) {
    var parentPath = path;
    var found = false;
    while (parentPath) {
      if (t.isBlockStatement(parentPath.node) && t.isFunction(parentPath.parent)) {
        found = true;
        break;
      }
      parentPath = parentPath.parentPath;
    }
    return parentPath;
  }

  /**
   * 根据当前ObjectProperty，反查嵌套object的父亲的key，并拼起来
   * @param {NodePath} path 
   */
  function getFuncName(path) {
    // 往上递归回溯objectExpression
    var propertyPath = path;
    var str = [];
    while (propertyPath) {
      if (t.isObjectProperty(propertyPath.node) || t.isObjectMethod(propertyPath.node)) {
        str.unshift(propertyPath.node.key.name);
        propertyPath = propertyPath.parentPath.parentPath;
      } else {
        break;
      }
    }
    str.unshift('Func');
    return str.join('_');
  }
  // 找到ObjectExpression定义，然后找里面的ObjectMethod
  // 然后提到当前作用域块级别(因为可能有闭包)
  path.traverse({
    ObjectExpression: function (path, state) {

      path.traverse({
        ObjectProperty: function (path, state) {
          if (!t.isIdentifier(path.node.key)) return;
          if (!t.isFunctionExpression(path.node.value)) return;
          // 箭头函数不处理
          if (t.isArrowFunctionExpression(path.node.value)) return;

          var prop = path.node.value;
          var uid = path.scope.generateUidIdentifier(getFuncName(path));
          getParentFunctionBody(path).pushContainer('body',
            t.functionDeclaration(uid, prop.params, prop.body, prop.generator, prop.async)
          );
          path.replaceWith(
            t.objectProperty(path.node.key, uid, path.node.computed, false, path.node.decorators)
          );
        },
        ObjectMethod: function (path, state) {
          if (!t.isIdentifier(path.node.key)) return;
          var uid = path.scope.generateUidIdentifier(getFuncName(path));
          var prop = path.node;
          getParentFunctionBody(path).pushContainer('body',
            t.functionDeclaration(uid, prop.params, prop.body, prop.generator, prop.async)
          );
          path.replaceWith(
            t.objectProperty(path.node.key, uid, path.node.computed, false, path.node.decorators)
          );
        }
      }, state);
    }
  }, state);

}

/**
 * 将MemberExpression的property(computed:false)和StringLiteral可复用部分提取出来
 * 
 * from
 * ```javascript
 * {
 *  a: 'bbb'
 * }
 * b.bbb
 * ```
 * 
 * to
 * ```javascript
 * const STR_bbb = 'bbb'
 * {
 *   a: STR_bbb
 * }
 * b[STR_bbb]
 * ```
 * 
 * @param {NodePath} path 
 * @param {State} state 
 */
function replaceMemberExpressionAndStringLiteral(path, state) {
  // 先扫描一遍字符串member-expression.property和StringLiteral
  const idCounts = foundCommonIdAndLiteral(path);
  // 再在特定作用域添加变量定义
  const nodeIdMap = insertStringDeclarator(path, idCounts, state);
  // 然后再回去替换computed
  replaceCommonIdAndLiteral(path, nodeIdMap);
}

function replaceCommonIdAndLiteral(path, nodeIdMap) {
  // 找到对应scopeId的uid塞回去

  function getInfoFromNodeMap(name, scopeId) {
    var key = `name:${name}_scope:${scopeId}`;
    return nodeIdMap[key];
  }

  path.traverse({
    MemberExpression: function (path) {
      // 只读取 property
      if (t.isMemberExpression(path.node, { computed: false })) {
        if (t.isIdentifier(path.node.property)) {
          var name = path.node.property.name;
          var scope = getTopIIFEScope(path);
          if (scope) {
            var info = getInfoFromNodeMap(name, scope.uid);
            if (info) {
              path.replaceWith(
                t.memberExpression(
                  path.node.object,
                  info.uid,
                  true
                )
              );
            }
          }
        }
      }
    },
    StringLiteral: function (path) {
      if (t.isStringLiteral(path.node)) {
        var name = path.node.value;
        var scope = getTopIIFEScope(path);
        if (scope) {
          var info = getInfoFromNodeMap(name, scope.uid);
          if (info) {
            if (t.isVariableDeclarator(path.parent)) {
              // 对于变量定义，需要看一下是不是uid自身定义
              if ( t.isIdentifier(path.parent.id) ) {
                if ( path.parent.id.name === info.uid.name ) {
                  // 不处理
                } else {
                  path.replaceWith(
                    info.uid
                  );
                }
              } else {
                // 理论上不会走到，走到就不处理
              }
            } else {
              path.replaceWith(
                info.uid
              );
            }
          }
        }
      }
    }
  });
}

/**
 * 找到对应scopeId的函数作用域，将变量定义插入
 * @param {NodePath} path 
 * @param {Record<string, { name: string, count: number, scopeId: number }>} idCounts 
 * @param {State} state 
 */
function insertStringDeclarator(path, idCounts, state) {

  function compareCount(a, b) {
    if (idCounts[a].count > idCounts[b].count) return -1;
    if (idCounts[a].count < idCounts[b].count) return 1;
    return 0;
  }

  var nodeIdMap = Object.create(null);

  // 遍历FunctionExpression和ArrowFunctionExpression
  // 如果遇到命中的scopedId，塞进去
  path.traverse({
    BlockStatement: insertToFuncionScope,
  }, state);

  /**
   * 把定义插入scope之后，记录下插入的id
   * @param {string} name 
   * @param {number} scopeId 
   * @param {Identifier} uid 
   */
  function addIdToNodeMap(name, scopeId, uid) {
    var key = `name:${name}_scope:${scopeId}`;
    nodeIdMap[key] = nodeIdMap[key] || {
      name: name,
      scopeId: scopeId,
      uid: uid
    };
  }

  function insertToFuncionScope(path, state) {
    if (!t.isFunction(path.parent)) return;
    var functionParentPath = path.parentPath;
    var scope = functionParentPath.scope;
    var scopeId = scope.uid;
    var needToInsertList = Object.keys(idCounts).filter(k => idCounts[k].scopeId === scopeId).sort(compareCount).map(k => idCounts[k]);
    if (needToInsertList.length) {
      // 开始往path塞
      var declarations = needToInsertList.map(obj => {
        var name = obj.name;
        var count = obj.count;
        /**
         * 是否公用的判定条件
         */
        if (
          name.length * (count - 1) >= 6 &&
          name.length >= 3
        ) {
          var id = scope.generateUidIdentifier('STR_' + name);
          var declarator = t.variableDeclarator(id, t.stringLiteral(name));
          addIdToNodeMap(name, scopeId, id);
          // 补充注释，对应引用次数
          declarator.trailingComments = [
            {
              type: 'CommentBlock',
              value: ' count: ' + count + ' '
            }
          ];
          return declarator;
        }
      }).filter(Boolean);
      if (declarations.length) {
        path.unshiftContainer('body',
          t.variableDeclaration('const', declarations)
        )
      }
    }
  }

  return nodeIdMap;
}

/**
 * 找到顶级函数作用域path
 * @param {NodePath} path 
 */
function getTopIIFEPath(path) {
  var parentPath = path;
  var topFunctionPath;
  var scope;
  while (parentPath) {
    if (
      t.isBlockStatement(parentPath.node) &&
      t.isFunction(parentPath.parent)
    ) {
      topFunctionPath = parentPath;
    }
    parentPath = parentPath.parentPath;
  }
  return topFunctionPath;
}

/**
 * 找到顶级函数作用域的对应scope
 * @param {NodePath} path 
 */
function getTopIIFEScope(path) {
  var topFunctionPath = getTopIIFEPath(path);
  return topFunctionPath && topFunctionPath.scope;
}

/**
 * 找到MemberExpression和StringLiteral节点，并记录该节点对应的顶级函数作用域的scopeId
 * @param {NodePath} path 
 */
function foundCommonIdAndLiteral(path) {
  var map = Object.create(null);
  // 记录的时候，记录以下信息
  // 特定name，特定最外层立即执行函数的scope_id
  // 不同外层scope下同名name不放在一起

  function addNameToMap(name, scopeId) {
    var key = `name:${name}_scope:${scopeId}`;
    map[key] = map[key] || {
      count: 0,
      name: name,
      scopeId: scopeId
    };
    map[key].count++;
  }

  path.traverse({
    MemberExpression: function (path, state) {
      // 只读取 property
      if (t.isMemberExpression(path.node, { computed: false })) {
        if (t.isIdentifier(path.node.property)) {
          var name = path.node.property.name;
          var topScope = getTopIIFEScope(path);
          if (topScope) {
            addNameToMap(name, topScope.uid);
          }
        }
      }
    },
    StringLiteral: function (path, state) {
      if (t.isStringLiteral(path.node)) {
        var name = path.node.value;
        var topScope = getTopIIFEScope(path);
        if (topScope) {
          addNameToMap(name, topScope.uid);
        }
      }
    }
  });
  return map;
}
