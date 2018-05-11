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


  var resourceMap = option.map;
  var shouldClearOther = !!option.onlyMap;

  if (resourceMap) {
    Object.keys(resourceMap).forEach(function (k) {
      var npmName = k;
      var configObj = resourceMap[k];
      if (!configObj) return;

      var external = configObj.external;
      var js = configObj.js;
      var css = configObj.css;

      if (!external) return;
      if (!js && !css) return;

      var msg = [js ? 'js: \'' + js + '\'' : null, css ? 'css: \'' + css + '\'' : null].filter(Boolean).join(',');
      hint.success('[Resource]', '"' + npmName + '"=>"global[\'' + external + '\']": (' + msg + ')');
    });
  }

  return !!resourceMap ? {
    resource: (0, _resource2.default)({
      resourceMap: resourceMap,
      shouldClearOther: shouldClearOther
    }),

    babel: null,

    webpack: null,

    browser: null
  } : null;
};

var _resource = require('./runtime/resource.js');

var _resource2 = _interopRequireDefault(_resource);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

var pluginName = exports.pluginName = '@ali/kylin-plugin-resource';
//# sourceMappingURL=index.js.map