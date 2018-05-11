'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateResourceImpl;
function generateResourceImpl() {

  return function resourceModifyImpl(_ref, kylinApp, program) {
    var js = _ref.js,
        externals = _ref.externals;


    if (program.prod) {
      js['Vue'] = 'https://a.alipayobjects.com/g/h5-lib/vue/2.1.6/vue.min.js';
    } else {
      js['Vue'] = 'https://a.alipayobjects.com/g/h5-lib/vue/2.1.6/vue.js';
    }

    return;
  };
}
//# sourceMappingURL=resource.js.map