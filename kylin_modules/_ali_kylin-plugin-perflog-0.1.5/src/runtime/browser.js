import { hookRender, tryHookUpdated, logPluginLoad } from '../utils/hook';
import { log } from '../utils/log';

if (typeof window !== 'undefined') {
  // 先尝试拦截一次
  tryHookUpdated();
}

export default function loadPlugin(kylinFramework) {
  if (typeof window === 'undefined') return;
  // 这次拦截肯定能中
  tryHookUpdated(kylinFramework.Vue);
  // console.log('框架对象', kylinFramework)
  try {
    const oldInitVue = kylinFramework.Page.prototype._initVue;

    kylinFramework.Page.prototype._initVue = function (option, el) {
      hookRender(option);
      oldInitVue.call(this, option, el);
    };

    logPluginLoad();
  } catch (ex) {
    log(ex);
  }
}

