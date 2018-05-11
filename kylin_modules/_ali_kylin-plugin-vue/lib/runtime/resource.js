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
        js['Vue'] = 'https://gw.alipayobjects.com/as/g/h5-lib/vue/2.5.13/vue.min.js';
      } else {
        js['Vue'] = 'https://gw.alipayobjects.com/as/g/h5-lib/vue/2.5.13/vue.js';
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