"use strict";

exports.__esModule = true;

exports.default = function () {
  var nebulaTarget = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "common";

  if (nebulaTargetEnvs.indexOf(nebulaTarget) === -1) {
    throw new Error("Preset es2015-nebula 'nebulaTarget' option must be one of " + nebulaTargetEnvs.join(', ') + ", but got '" + nebulaTarget + "' ");
  }
  return Strategy[nebulaTarget];
};

var _strategy = require("./strategy");

var Strategy = _interopRequireWildcard(_strategy);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var nebulaTargetEnvs = ["common", "ios8", "u4", "ios9", "common_no_promise"];

module.exports = exports["default"];