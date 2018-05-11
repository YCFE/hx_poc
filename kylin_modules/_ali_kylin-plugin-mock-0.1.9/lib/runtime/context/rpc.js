'use strict';

function getContext() {
  return require.context(__KYLIN_PLUGIN_LUNA_MOCK_WORKING_DIR__ + '/rpc/', true, /\.js$/);
}

exports.context = getContext();

if (module.hot) {
  module.hot.accept(exports.context.id, function () {
    exports.context = getContext();
  });
}
//# sourceMappingURL=rpc.js.map