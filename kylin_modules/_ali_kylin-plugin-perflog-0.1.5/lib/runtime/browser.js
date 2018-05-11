'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadPlugin;

var _hook = require('../utils/hook');

var _log = require('../utils/log');

if (typeof window !== 'undefined') {
  (0, _hook.tryHookUpdated)();
}

function loadPlugin(kylinFramework) {
  if (typeof window === 'undefined') return;

  (0, _hook.tryHookUpdated)(kylinFramework.Vue);

  try {
    var oldInitVue = kylinFramework.Page.prototype._initVue;

    kylinFramework.Page.prototype._initVue = function (option, el) {
      (0, _hook.hookRender)(option);
      oldInitVue.call(this, option, el);
    };

    (0, _hook.logPluginLoad)();
  } catch (ex) {
    (0, _log.log)(ex);
  }
}
//# sourceMappingURL=browser.js.map