'use strict';

exports.__esModule = true;
exports.loadPlugin = loadPlugin;
function loadPlugin(kylinFramework, _exports) {
  if (typeof window !== 'undefined') {
    var pluginList = window.__kylin_plugin_browser_func_arr__ || [];

    if (typeof pluginList.forEach === 'function') {
      pluginList.forEach(function (func) {
        if (typeof func === 'function') {
          func.call(null, kylinFramework, _exports);
        }
      });
    }
  }
}
//# sourceMappingURL=plugins.js.map