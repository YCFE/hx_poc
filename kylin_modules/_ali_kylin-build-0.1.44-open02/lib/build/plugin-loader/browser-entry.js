'use strict';

/*global window:true*/
// 严格ES5!!
(function () {
  'use strict';

  function interopRequireDefault(obj) {
    return obj && obj.default ? obj.default : obj;
  }

  var pluginResolveFuncList;

  try {
    // caused error if not be replaced
    // eslint-disable-next-line
    pluginResolveFuncList = __TO_BE_REPLACE_PLUGIN_PATH_ARRAY__;
    pluginResolveFuncList = pluginResolveFuncList.map(interopRequireDefault);

    // safe
    if (typeof window !== undefined) {
      window.__kylin_plugin_browser_func_arr__ = pluginResolveFuncList;
    }
  } catch (ex) {
    if (typeof console.error === 'function') {
      console.error(ex);
    }
  }
})();