'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateResourceImpl;
function generateResourceImpl() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var useExternal = option.external === undefined ? true : !!option.external;

  return function resourceModifyImpl(_ref, kylinApp, program) {
    var js = _ref.js,
        externals = _ref.externals,
        css = _ref.css;

    if (useExternal) {
      if (program.prod) {
        js['Vue'] = 'https://cn-hangzhou-mdsweb.cloud.alipay.com/E508030101442_FinMallDev/common/vue.min.js';
        js['Vuex'] = 'https://cn-hangzhou-mdsweb.cloud.alipay.com/E508030101442_FinMallDev/common/vuex.min.js';
      } else {
        js['Vue'] = 'https://cdn.bootcss.com/vue/2.5.16/vue.min.js';
        js['Vuex'] = 'https://cdn.bootcss.com/vuex/3.0.0/vuex.min.js';
      }
    } else {
      delete externals['vue'];
      delete js['Vue'];
      delete css['Vue'];
    }

    return;
  };
}
//# sourceMappingURL=resource.js.map
