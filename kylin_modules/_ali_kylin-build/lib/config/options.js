'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userOption = userOption;

var _kylinOptions = require('../build/utils/kylinOptions');

var _kylinOptions2 = _interopRequireDefault(_kylinOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function userOption() {
  let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let modifyMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


  const newOptions = (0, _kylinOptions2.default)(params.options);

  // 针对一些不支持的参数开启，打下警告，比如
  // enableGlobalResourceInject ...

  return {
    vueStyleExtract: params.vueStyleExtract, // 默认undefined, 自动检测，给定布尔值就强制
    vueStylePublichPath: params.vueStylePublichPath || '../',
    forceVueConfig: !!params.forceVueConfig,
    forceES2015Nebula: !!params.forceES2015Nebula,
    forceVueJSX: !!params.forceVueJSX,
    env: params.env || 'production',
    options: newOptions
  };
}