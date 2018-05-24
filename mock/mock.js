/*!
 * @alipay/luna-mock - 支付宝H5容器本地浏览器mock
 * Author: 简钰 <jianyu.lxd@alibaba-inc.com>
 * Version: 0.5.1
 * // code77
 */
(function () {
  'use strict';

  function setSharedData(opts) {
    var data = opts.data;
    for (var key in data) {
      // var res = {data: data[key]};
      var res = data[key];
      window.localStorage.setItem(key, JSON.stringify(res));
    }
  }

  function getSharedData(opts, callback) {
    var keys = opts.keys;

    var results = {};
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var b = window.localStorage.getItem(key);
      results[key] = JSON.parse(b);
    }

    callback && callback({
      data: results,
    });
  }

  function removeSharedData(opts) {
    var keys = opts.keys;

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      window.localStorage.removeItem(key);
    }
  }

  function setAPDataStorage(opts, callback) {
    window.localStorage.setItem(opts.key, opts.value);

    callback({
      error: 0,
    });
  }

  function getAPDataStorage(opts, callback) {
    var value = window.localStorage.getItem(opts.key);

    setTimeout(function () {
      callback({
        error: 0,
        data: value,
      });
    }, 0);
  }

  function removeAPDataStorage(opts, callback) {
    window.localStorage.removeItem(opts.key);

    callback({
      error: 0,
    });
  }

  var mockTitleBar;

  function createTitleBar(opts) {
    if (mockTitleBar) { return; }

    var title = opts.title;
    if (!title) {
      var icon = opts.icon;
      if (icon) {
        if (!/\.(png|jpg|jpeg)$/.test(icon)) {
          icon = "data:image/png;base64," + icon;
        }
        title = "<img src=\"" + icon + "\">";
      } else {
        title = opts.icontype;
      }
    }

    var btn = document.createElement('div');
    btn.innerHTML = title;
    btn.style.cssText = 'position:absolute;top:0;right:10px;';

    // 0才显示红点
    if (opts.redDot === '0') {
      btn.insertAdjacentHTML('beforeend', '<span style="display:inline-block; position:absolute; top:3px; right:1px; width:5px; height:5px; border-radius:5px; background:red;"/>');
    }

    btn.onclick = function () {
      var event = document.createEvent('HTMLEvents');
      event.initEvent('optionMenu', false, false);
      document.dispatchEvent(event);
    };

    var titleBar = document.createElement('div');
    titleBar.style.cssText = 'position:fixed; top:0; width:100%; z-index:999999;';
    titleBar.appendChild(btn);

    mockTitleBar = titleBar;

    document.body.appendChild(titleBar);
  }

  function removeTitleBar() {
    if (mockTitleBar) {
      mockTitleBar.parentNode.removeChild(mockTitleBar);
      mockTitleBar = null;
    }
  }

  function pushWindow(opts) {
    window.location.href = opts.url;
    console.info(opts.param);
  }

  function popTo(opts) {
    window.location.href = opts.urlPattern;
  }

  function popWindow() {
    window.history.back();
  }

  function alert(opts, callback) {
    window.alert(opts.message);
    callback && callback();
  }

  function confirm(opts, callback) {
    var message = opts.message || opts.title;
    var result = window.confirm(message);
    callback && callback({
      ok: result,
    });
  }

  function toast(opts, callback) {
    console.info(opts);
    callback && callback();
  }

  function downloadImage(opts, callback) {
    console.info(opts);

    var data = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAABGdBTUEAALGPC/xhBQAAAWNJREFUGBk9kL9Lw0Acxd8llyZtBVvBHyCKOlioOHRRF1cXN6GLiC4u/gEOokPF0UVwEh10szjr6H/goouotUspDk2t2jZp0uR8jdKDu/ve3ec93vcE7pSJVuMCwBqU8qFY9YboTWHwfAs0tyRaXycwrA14LqAEZpJaxJRaYcQjZubhqZhA0Xagada4KWAphcJ8giYKh08OHCFQdSkwTEjKPN5bGTpNE55KaBG4mJKoeApVh6DfgRb5hwrPPwFsX+HszcXlu4edjInvgIH/M0tQkEtLrE8YiOuATZdyM0BME3hsBH85ucoEH3ODOo5fXHQpWhmRuFpKok7BHl1vKj5e2ZgUDBxjAPYBi/vyMMFyB/cfXexmLezPxVFqhvyJ61p7YciMb05KpAyBh88Ap6UOusyn6wKrYwa2ZwcIFu0jmMmDfhg2BgL9wThw2ucCBaUhW8/zL0cjmz7BQlIRqhry6etfw06FpLjKvFEAAAAASUVORK5CYII=';
    callback && callback({
      data: data,
    });
  }

  function log(callType, name, opts, callbackOpts) {
    var strOpts = JSON.stringify(opts);
    var maxLength = 500;
    if (strOpts && strOpts.length > maxLength) {
      strOpts = strOpts.slice(0, maxLength);
      strOpts += '...';
    }

    var config = window.lunaMockConfig || {};
    if (config.disableLog) { return; }

    console.groupCollapsed(("【" + callType + "】" + name + ": " + strOpts));
    console.info('name:', name);
    console.info('opts:', opts);
    console.info('callback参数:', callbackOpts);
    console.info('callback参数的字符串形式:', JSON.stringify(callbackOpts));
    console.trace();
    console.groupEnd();
  }

  // 异步log，跟下面一致，免得顺序乱了
  function asyncLog() {
    var this$1 = this;

    var args = arguments;

    setTimeout(function () {
      log.apply(this$1, args);
    });
  }

  function callbackWithLog(callType, name, opts, callback) {
    var tid = setTimeout(function () {
      log((callType + "请求"), name, opts);
    });

    // 假设所有的callback的调用参数都只有一个
    return function _callbackWithLog(result) {
      // 如果本方法没有马上执行，那么自动异步log
      clearTimeout(tid);

      asyncLog((callType + "返回"), name, opts, result);

      callback && callback.apply(this, arguments);
    };
  }

  function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }

  // 内置的默认mock，仅仅在chrome等环境中为保证程序正常运行，进行必要的mock，真实环境中应该完全屏蔽掉
  var defaultMock = {
    setSharedData: setSharedData,
    getSharedData: getSharedData,
    removeSharedData: removeSharedData,

    setAPDataStorage: setAPDataStorage,
    getAPDataStorage: getAPDataStorage,
    removeAPDataStorage: removeAPDataStorage,

    alert: alert,
    confirm: confirm,
    toast: toast,

    setOptionMenu: createTitleBar,
    hideOptionMenu: removeTitleBar,

    pushWindow: pushWindow,
    popTo: popTo,
    popWindow: popWindow,

    downloadImage: downloadImage,
  };

  function defaultMockCall(originAlipayJSBridge) {
    return function (name, opts, callback) {
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
        asyncLog('兜底mock', name, opts, {});
        callback && callback({});
      }
    };
  }

  /**
   * H5容器mock方案
   *
   */
  var config = window.lunaMockConfig || {};


  function extend(obj) {
    var arguments$1 = arguments;

    var length = arguments.length;
    if (length < 2 || obj == null) { return obj; }

    for (var index = 1; index < length; index += 1) {
      var source = arguments$1[index];
      for (var key in source) {
        obj[key] = source[key];
      }
    }
    return obj;
  }

  function doMock(originAlipayJSBridge) {
    console.info(("使用luna-mock，处于【" + (originAlipayJSBridge ? 'Nebula' : '浏览器') + "】模式"));

    var AlipayJSBridge = extend({}, originAlipayJSBridge);
    var originCallFunc = AlipayJSBridge.call;
    // 暂时不用，看未来需要
    // const originParamsObj = originAlipayJSBridge.startupParams;

    // 内部使用
    var _originCall = function (name, opts, callback) {
      if (!isFunction(opts)) {
        originCallFunc.call(originAlipayJSBridge, name, opts, callbackWithLog('原生', name, opts, callback));
      } else {
        // 如果opts传入了callback
        originCallFunc.call(originAlipayJSBridge, name, callbackWithLog('原生', name, undefined, opts));
      }
    };

    // 调用原生mock
    var originCall = function (name, opts, callback) {
      if (originAlipayJSBridge) {
        _originCall(name, opts, callback);
      } else {
        asyncLog('没有找到原生实现', name, opts);
      }
    };

    // 如果有原生实现就使用原生实现，否则使用默认实现
    var defaultMockCall$$1 = defaultMockCall(originAlipayJSBridge);
    var doDefault = function (name, opts, callback) {
      if (originAlipayJSBridge) {
        // 如果有原生实现，则使用
        _originCall(name, opts, callback);
      } else {
        // 否则使用defaultMock

        var _callback = callback;
        var _opts = opts;

        // 如果opts传入了callback
        if (isFunction(opts)) {
          _callback = opts;
          _opts = undefined;
        }
        defaultMockCall$$1(name, _opts, _callback);
      }
    };

    // 处理用户自定义mock
    var doUserMock = function (userMock, name, opts, callback) {
      var userMockCall = function () {
        var _callback = callback;
        var _opts = opts;

        // 如果opts传入了callback
        if (isFunction(opts)) {
          _callback = opts;
          _opts = undefined;
        }

        // 运行用户配置的mock方案
        var callResult = userMock(_opts, callbackWithLog('自定义', name, _opts, _callback));

        // 如果用户的自定义mock方法返回false，则继续使用默认实现
        if (callResult === false) {
          doDefault(name, opts, callback);
        }
      };

      var useRpcMockList = function () {
        for (var i = 0; i < config.rpcMockList.length; i += 1) {
          var rpcMock = config.rpcMockList[i];

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

    AlipayJSBridge.call = function (name, opts, callback) {
      // 如果用户自定义了call
      if (config.call) {
        var userMock = config.call[name];

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

    // 即便是mock 原生对象，也不要直接替换，而是只修改 call/startupParams 属性
    // 因为 ap 暂存了对象，这么搞的话，会导致ap暂存的对象没被修改。。然后所有mock无法生效
    if (originAlipayJSBridge && window.AlipayJSBridge) {
      // 有原生对象
      if (config.startupParams !== false) {
        window.AlipayJSBridge.startupParams = config.startupParams || {};
      }
      window.AlipayJSBridge.call = AlipayJSBridge.call;
    } else {
      // 没有
      // TODO: config.startupParams设为false则使用默认startupParams
      if (config.startupParams !== false) {
        AlipayJSBridge.startupParams = config.startupParams || {};
      }

      // 覆盖原来的全局变量
      window.AlipayJSBridge = AlipayJSBridge;
    }

    return true;
  }

  function triggerReadyEvent() {
    var event = document.createEvent('HTMLEvents');
    // 不能冒泡，不能取消
    event.initEvent('AlipayJSBridgeReady', false, false);
    document.dispatchEvent(event);
  }

  function run() {
    // 只能运行一次
    if (window.__hasLunaMock) { return; }

    // 如果config.forbidAll设为true，则不进行任何mock
    if (config.forbidAll) { return; }

    var runInNebula = /alipayclient/i.test(window.navigator.userAgent);
    // luna-devtools给页面设的标记
    var runInBrowser = document.documentElement.hasAttribute('__WITH_LUNA_DEVTOOLS');

    var shouldMockWithoutAlipayJSBridge = (function () {
      var result;

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
      var mockResult = doMock();

      if (mockResult) {
        // 异步才能使得window上有AlipayJSBridge
        setTimeout(function () {
          triggerReadyEvent();
        });
      }
    } else if (window.AlipayJSBridge) {
      doMock(window.AlipayJSBridge);
    } else {
      document.addEventListener('AlipayJSBridgeReady', function () {
        doMock(window.AlipayJSBridge);
      });
    }

    window.__hasLunaMock = true;
  }

  run();

  }());
