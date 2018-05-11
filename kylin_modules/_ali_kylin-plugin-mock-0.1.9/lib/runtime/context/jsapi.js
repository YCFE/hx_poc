'use strict';

function getContext() {
  return require.context(__KYLIN_PLUGIN_LUNA_MOCK_WORKING_DIR__ + '/jsapi/', true, /\.js$/);
}

exports.context = getContext();

if (module.hot) {
  module.hot.accept(exports.context.id, function () {
    exports.context = getContext();
  });
}
//# sourceMappingURL=jsapi.js.map