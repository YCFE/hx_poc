import { setSharedData, getSharedData, removeSharedData } from './plugins/sharedData';
import { setAPDataStorage, getAPDataStorage, removeAPDataStorage } from './plugins/apDataStorage';
import { createTitleBar, removeTitleBar } from './plugins/titleBar';
import { pushWindow, popTo, popWindow } from './plugins/window';
import { alert, confirm, toast } from './plugins/prompt';
import { downloadImage } from './plugins/image';

import { callbackWithLog, asyncLog as log } from './utils';

// 内置的默认mock，仅仅在chrome等环境中为保证程序正常运行，进行必要的mock，真实环境中应该完全屏蔽掉
const defaultMock = {
  setSharedData,
  getSharedData,
  removeSharedData,

  setAPDataStorage,
  getAPDataStorage,
  removeAPDataStorage,

  alert,
  confirm,
  toast,

  setOptionMenu: createTitleBar,
  hideOptionMenu: removeTitleBar,

  pushWindow,
  popTo,
  popWindow,

  downloadImage,
};

export function defaultMockCall(originAlipayJSBridge) {
  return (name, opts, callback) => {
    if (defaultMock[name]) {
      // 预设的mock
      defaultMock[name](opts, callbackWithLog('mock', name, opts, callback));
    } else {
      // console.info在容器中实际上会触发debugconsole，因此会无限循环，需要特殊处理
      // TODO: 可能根本不需要，为了用户mock中可能的console
      if (name === 'debugconsole') {
        originAlipayJSBridge.call(name, opts, callback);
        return;
      }

      // 兜底
      log('兜底mock', name, opts, {});
      callback && callback({});
    }
  };
}

