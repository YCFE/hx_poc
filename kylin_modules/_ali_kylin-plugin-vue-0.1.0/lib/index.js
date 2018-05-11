'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginName = undefined;

exports.default = function (_ref) {
  var program = _ref.program,
      kylinApp = _ref.kylinApp,
      hint = _ref.hint;
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  return {
    resource: (0, _resource2.default)()
  };
};

var _build = require('./runtime/build.js');

var _build2 = _interopRequireDefault(_build);

var _babel = require('./runtime/babel.js');

var _babel2 = _interopRequireDefault(_babel);

var _resource = require('./runtime/resource.js');

var _resource2 = _interopRequireDefault(_resource);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

var pluginName = exports.pluginName = '@ali/kylin-plugin-vue';
//# sourceMappingURL=index.js.map