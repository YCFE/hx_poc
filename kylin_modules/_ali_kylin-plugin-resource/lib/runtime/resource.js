"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateResourceImpl;
function generateResourceImpl(_ref) {
  var resourceMap = _ref.resourceMap,
      shouldClearOther = _ref.shouldClearOther;


  return function resourceModifyImpl(globalResource, kylinApp, program) {

    if (shouldClearOther) {
      [globalResource.js, globalResource.css, globalResource.externals].forEach(function (obj) {
        dropKeys(obj);
      });
    }

    Object.keys(resourceMap).forEach(function (k) {
      var npmName = k;
      var configObj = resourceMap[k];
      var external = configObj.external;
      var js = configObj.js;
      var css = configObj.css;

      globalResource.externals[npmName] = external;
      if (css !== undefined) {
        globalResource.css[external] = css;
      }
      if (js !== undefined) {
        globalResource.js[external] = js;
      }
    });
  };
}

function dropKeys(obj) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      delete obj[k];
    }
  }
}
//# sourceMappingURL=resource.js.map