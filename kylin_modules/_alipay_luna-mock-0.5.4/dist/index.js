/*!
 * @alipay/luna-mock - 支付宝H5容器本地浏览器mock
 * Author: 简钰 <jianyu.lxd@alibaba-inc.com>
 * Version: 0.5.4
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

/**
 * 得到 base64，目前只支持图片 url，不支持 djangoId
 * 注：只能是对允许跨域的文件
 * @param {string} url
 * @param {function(string)} cbk
 */
function getBase64ByUrl(url, cbk) {
  var xhr = new window.XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
    var reader = new window.FileReader();
    reader.onloadend = function () {
      var base64Str = reader.result.replace(/data:(.+)?;base64,/, '');
      cbk && cbk(base64Str);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.onerror = function () {
    cbk && cbk('');
  };
  xhr.open('GET', url);
  xhr.send();
}

var defaultImg = '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';
/**
 * 下载一个图片，获取 base 64 编码
 * @param {object} opts {multimediaID, width, height, match}
 * @param {function()} callback
 */
function downloadImage(opts, callback) {
  if (/http(s)?:\/\//.test(opts.multimediaID)) { // 如果是链接直接返回链接
    var url = opts.multimediaID;
    getBase64ByUrl(url, function (imgData) {
      var _imgData = imgData || defaultImg;
      callback && callback({ data: _imgData });
    });
  } else { // 否则返回默认图
    callback && callback({ data: defaultImg });
  }
}

var isArray = Array.isArray || function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function deepCopy(destination, source) {
  for (var key in source) {
    var value = source[key];

    if (isArray(value)) {
      value = deepCopy([], value);
    } else if (isObject(value)) {
      value = deepCopy({}, value);
    }

    destination[key] = value;
  }

  return destination;
}

function log(callType, name, opts, callbackOpts) {
  // debugconsole是容器自动发出的，会导致循环调用
  if (name === 'debugconsole') { return; }

  var config = window.lunaMockConfig || {};
  if (config.disableLog) { return; }

  var strOpts = JSON.stringify(opts);
  var maxLength = 500;
  if (strOpts && strOpts.length > maxLength) {
    strOpts = strOpts.slice(0, maxLength);
    strOpts += '...';
  }

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

    // 防止业务代码中修改了 mock 的返回值，从而污染到 log
    var newResult = deepCopy({}, result);

    asyncLog((callType + "返回"), name, opts, newResult);

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

  // 需要存起来，因为后面会覆盖
  var originCallFunc = AlipayJSBridge.call;
  // 暂时不用，看未来需要
  // const originStartupParams = AlipayJSBridge.startupParams;

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
