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


  var allowMockProd = program.rawArgs.indexOf('--allow-mock-prod') >= 0;

  var enable = [typeof program.mock === 'boolean' ? program.mock : undefined, typeof program.mock === 'undefined' ? undefined : !!program.mock, typeof option.enable === 'boolean' ? option.enable : undefined, false].filter(function (d) {
    return typeof d === 'boolean';
  })[0];

  if (program.prod && !allowMockProd && enable) {
    hint.warn("[Mock]", 'prod\u6784\u5EFA\u5173\u95EDmock\u529F\u80FD');
    enable = false;
  }

  var config = [typeof program.mock === 'string' ? program.mock : '', typeof option.config === 'string' ? option.config : '', './mock/mock.config.js'].filter(Boolean)[0];

  var absoluteConfig = _path2.default.resolve(cwd, config);

  if (enable) {
    if (_fs2.default.existsSync(absoluteConfig)) {
      hint.success("[Mock]", '\u52A0\u8F7D LunaMock \u914D\u7F6E ' + config);
    } else {
      enable = false;
      hint.error("[Mock]", _chalk2.default.red('\u6CA1\u6709\u627E\u5230') + ' [' + _chalk2.default.red(config) + '] ' + _chalk2.default.red('\uFF0C\u5C06\u4F7F\u7528\u9ED8\u8BA4\u914D\u7F6E\uFF0C\u65E0\u6CD5\u4F7F\u7528\u81EA\u5B9A\u4E49mock\u529F\u80FD\uFF0C') + '\n\u8BF7\u53C2\u8003' + _chalk2.default.yellow('http://gitlab.alipay-inc.com/luna/luna-mock/blob/master/demo/mock.config.js'));
    }
  }

  return enable ? {
    babel: null,

    webpack: (0, _build2.default)(absoluteConfig),

    browser: require.resolve('./runtime/browser.js')
  } : {};
};

var _build = require('./runtime/build.js');

var _build2 = _interopRequireDefault(_build);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

var pluginName = exports.pluginName = '@ali/kylin-plugin-mock';
//# sourceMappingURL=index.js.map