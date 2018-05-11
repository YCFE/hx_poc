'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLangConfigStatus = getLangConfigStatus;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

function getLangConfigStatus(_ref) {
  var cwd = _ref.cwd,
      configDir = _ref.configDir,
      absoluteConfigDir = _ref.absoluteConfigDir;


  var langConfigDir = absoluteConfigDir;

  var ret = {
    dir: {},
    files: {}
  };

  try {
    var fileStat = _fs2.default.statSync(langConfigDir);
    if (fileStat.isDirectory()) {
      ret.dir = {
        success: true,
        msg: '[' + configDir + '] \u76EE\u5F55\u5B58\u5728'
      };

      var fileList = _glob2.default.sync(_path2.default.resolve(langConfigDir, '*.js'));
      if (fileList.length > 0) {
        ret.files = {
          success: true,
          msg: '[' + configDir + '] \u5305\u542B\u8BED\u8A00\u6587\u4EF6[ ' + _chalk2.default.yellow(fileList.map(function (p) {
            return _path2.default.relative(langConfigDir, p);
          }).join(', ')) + ']'
        };
      } else {
        ret.files = {
          success: false,
          msg: '[' + _chalk2.default.red(configDir) + '] \u76EE\u5F55\u4E0D\u5305\u542B' + _chalk2.default.red('*.js') + '\u6587\u4EF6'
        };
      }
    } else {
      ret.dir = {
        success: false,
        msg: '[' + _chalk2.default.red(configDir) + '] \u4E0D\u662F\u76EE\u5F55'
      };
    }
  } catch (ex) {
    console.error(ex);
    ret.dir = {
      success: false,
      msg: '[' + _chalk2.default.red(configDir) + '] \u76EE\u5F55\u4E0D\u5B58\u5728'
    };
  }

  return ret;
}
//# sourceMappingURL=utils.js.map