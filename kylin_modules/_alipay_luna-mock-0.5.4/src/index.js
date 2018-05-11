/**
 * H5容器mock方案
 *
 */
import { defaultMockCall as _defaultMockCall } from './defaultMockCall';
import { callbackWithLog, asyncLog as log, isFunction } from './utils';

const config = window.lunaMockConfig || {};


function extend(obj) {
  const length = arguments.length;
  if (length < 2 || obj == null) return obj;

  for (let index = 1; index < length; index += 1) {
    const source = arguments[index];
    for (const key in source) {
      obj[key] = source[key];
    }
  }
  return obj;
}

function doMock(originAlipayJSBridge) {
  console.info(`使用luna-mock，处于【${originAlipayJSBridge ? 'Nebula' : '浏览器'}】模式`);

  const AlipayJSBridge = extend({}, originAlipayJSBridge);

  // 需要存起来，因为后面会覆盖
  const originCallFunc = AlipayJSBridge.call;
  // 暂时不用，看未来需要
  // const originStartupParams = AlipayJSBridge.startupParams;

  // 内部使用
  const _originCall = (name, opts, callback) => {
    if (!isFunction(opts)) {
      originCallFunc.call(originAlipayJSBridge, name, opts, callbackWithLog('原生', name, opts, callback));
    } else {
      // 如果opts传入了callback
      originCallFunc.call(originAlipayJSBridge, name, callbackWithLog('原生', name, undefined, opts));
    }
  };

  // 调用原生mock
  const originCall = (name, opts, callback) => {
    if (originAlipayJSBridge) {
      _originCall(name, opts, callback);
    } else {
      log('没有找到原生实现', name, opts);
    }
  };

  // 如果有原生实现就使用原生实现，否则使用默认实现
  const defaultMockCall = _defaultMockCall(originAlipayJSBridge);
  const doDefault = (name, opts, callback) => {
    if (originAlipayJSBridge) {
      // 如果有原生实现，则使用
      _originCall(name, opts, callback);
    } else {
      // 否则使用defaultMock

      let _callback = callback;
      let _opts = opts;

      // 如果opts传入了callback
      if (isFunction(opts)) {
        _callback = opts;
        _opts = undefined;
      }
      defaultMockCall(name, _opts, _callback);
    }
  };

  // 处理用户自定义mock
  const doUserMock = (userMock, name, opts, callback) => {
    const userMockCall = () => {
      let _callback = callback;
      let _opts = opts;

      // 如果opts传入了callback
      if (isFunction(opts)) {
        _callback = opts;
        _opts = undefined;
      }

      // 运行用户配置的mock方案
      const callResult = userMock(_opts, callbackWithLog('自定义', name, _opts, _callback));

      // 如果用户的自定义mock方法返回false，则继续使用默认实现
      if (callResult === false) {
        doDefault(name, opts, callback);
      }
    };

    const useRpcMockList = () => {
      for (let i = 0; i < config.rpcMockList.length; i += 1) {
        const rpcMock = config.rpcMockList[i];

        if (rpcMock === opts.operationType) {
          return true;
        } else if (isFunction(rpcMock)) {
          if (rpcMock(opts)) {
            return true;
          }
        }
      }

      return false;
    };

    // 对rpc的mock白名单进行特殊处理
    if (name === 'rpc' && config.rpcMockList) {
      if (useRpcMockList()) {
        userMockCall();
      } else {
        // 不在白名单里，使用默认实现
        doDefault(name, opts, callback);
      }
    } else {
      userMockCall();
    }
  };

  AlipayJSBridge.call = (name, opts, callback) => {
    // 如果用户自定义了call
    if (config.call) {
      const userMock = config.call[name];

      if (isFunction(userMock)) {
        // 处理用户自定义mock
        doUserMock(userMock, name, opts, callback);
      } else if (userMock === false) {
        // 如果用户显式设置某种call为false，则使用原生实现
        originCall(name, opts, callback);
      } else {
        // 如果用户根本没有配置该name，使用兜底方案
        doDefault(name, opts, callback);
      }
    } else if (config.call === false) {
      // 如果用户显式设置config.call为false，则使用原生实现
      originCall(name, opts, callback);
    } else {
      // 默认兜底方案
      doDefault(name, opts, callback);
    }
  };

  // 重写全局变量
  window.AlipayJSBridge = window.AlipayJSBridge || {};

  // TODO: config.startupParams设为false则使用默认startupParams
  if (config.startupParams !== false) {
    window.AlipayJSBridge.startupParams = config.startupParams || {};
  }

  // 即便是mock 原生对象，也不要直接替换，而是只修改 call/startupParams 属性
  // 因为 ap 暂存了对象，这么搞的话，会导致ap暂存的对象没被修改。。然后所有mock无法生效
  window.AlipayJSBridge.call = AlipayJSBridge.call;

  return true;
}

function triggerReadyEvent() {
  const event = document.createEvent('HTMLEvents');
  // 不能冒泡，不能取消
  event.initEvent('AlipayJSBridgeReady', false, false);
  document.dispatchEvent(event);
}

function run() {
  // 只能运行一次
  if (window.__hasLunaMock) return;

  // 如果config.forbidAll设为true，则不进行任何mock
  if (config.forbidAll) return;

  const runInNebula = /alipayclient/i.test(window.navigator.userAgent);
  // luna-devtools给页面设的标记
  const runInBrowser = document.documentElement.hasAttribute('__WITH_LUNA_DEVTOOLS');

  const shouldMockWithoutAlipayJSBridge = (() => {
    let result;

    // 首先以用户配置为准
    if (typeof config.runInBrowser === 'boolean') {
      result = config.runInBrowser;
    } else if (runInBrowser) {
      result = true;
    } else if (runInNebula) {
      result = false;
    } else {
      // 其他情况认为没有window.AlipayJSBridge，所以设为true才能正常执行下去
      result = true;
    }

    return result;
  })();

  if (shouldMockWithoutAlipayJSBridge) {
    const mockResult = doMock();

    if (mockResult) {
      // 异步才能使得window上有AlipayJSBridge
      setTimeout(() => {
        triggerReadyEvent();
      });
    }
  } else if (window.AlipayJSBridge) {
    doMock(window.AlipayJSBridge);
  } else {
    document.addEventListener('AlipayJSBridgeReady', () => {
      doMock(window.AlipayJSBridge);
    });
  }

  window.__hasLunaMock = true;
}

run();
