function hasStrictModeDirective(path) {
  var node = path.isProgram() ? path.node : path.node.body;
  var directives = node.directives;

  return directives && directives.filter(
    function (d) {
      return (
        d.value &&
        d.value.type === "DirectiveLiteral" &&
        d.value.value === "use strict"
      )
    }
  ).length > 0;
}

function isStrictMode(path) {
  while (path) {
    if (hasStrictModeDirective(path)) {
      return true;
    }
    path = path.getFunctionParent();
  }
  return false;
}

function isHoisted(path, parentFn) {
  const parentScope = path.scope.parent;
  const fnScope = parentFn.scope;

  return path.scope.parent === parentFn.scope;
}


function hoistFunction(path, babel) {
  // process with hoist_function
  path.traverse({
    FunctionDeclaration: {
      exit(path) {
        const parentFn = path.getFunctionParent();
        if (
          // isStrictMode(parentFn) || 
          isHoisted(path, parentFn)
        ) {
          return;
        }

        const container = (
          parentFn.isProgram()
          ? parentFn
          : parentFn.get("body")
        );

        container.unshiftContainer("body", babel.types.clone(path.node));
        path.remove();
      }
    }
  })
}

exports.hoistFunction = hoistFunction;
