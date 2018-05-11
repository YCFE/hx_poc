'use strict';

function handleRpcPrefix(name, prefixes) {
  for (var key in prefixes) {
    if (prefixes.hasOwnProperty(key)) {
      name = name.replace(key, prefixes[key]);
    }
  }
  return name;
}

// luna-mock-scene=scene1 => scene1
function getSceneName() {
  var m = location.search.match(/[?&]luna-mock-scene=(\w+)/);
  return m && m[1] || '';
}

// name 使用特定延迟时间
function handleSepcialDelay(specialDelay, name, data, callback) {
  if (specialDelay) {
    if (name in specialDelay) {
      setTimeout(function () {
        callback && callback(data);
      }, specialDelay[name]);

      return true;
    }
  }
}

function handleJsapis(requireContext) {
  var jsapiKeys = requireContext.jsapiContext && requireContext.jsapiContext.keys() || [];

  var jsapis = [];
  jsapiKeys.forEach(function (key) {
    var dirRe = /^\.\/([^/]+)\/index\.js$/;
    var fileRe = /^\.\/([^/]+)\.js$/;

    var ma = void 0;
    if (dirRe.test(key)) {
      ma = key.match(dirRe);
      if (ma) {
        jsapis.push(ma[1]);
      }
    } else if (fileRe.test(key)) {
      ma = key.match(fileRe);
      if (ma) {
        jsapis.push(ma[1]);
      }
    }
  });

  return jsapis;
}

function lunaMockSimpleConfig() {
  var simpleConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var requireContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var sceneName = getSceneName();

  function getFromContext(type, name) {
    var context = type === 'rpc' ? requireContext.rpcContext : requireContext.jsapiContext;

    var keyList = ['./' + name + '.js', './' + name + '/index.js'];

    for (var i = 0; i < keyList.length; i++) {
      try {
        return context(keyList[i]);
      } catch (ex) {}
    }

    console.error('没有找到 mock 文件: ' + keyList.join(' 或 '));

    return undefined;
  }

  function call(type, name) {
    if (simpleConfig.handleMockName) {
      // 兼容老版接口，现在推荐使用 rpcPrefix
      name = simpleConfig.handleMockName(name);
    } else if (simpleConfig.rpcPrefix) {
      name = handleRpcPrefix(name, simpleConfig.rpcPrefix);
    }

    return function (opts, callback) {
      var fn = getFromContext(type, name);

      if (!fn) {
        // 继续调用真实接口
        return false;
      }

      var data = typeof fn === 'function' ? fn(opts, sceneName) : fn;

      if (!handleSepcialDelay(simpleConfig.specialDelay, name, data, callback)) {
        if (simpleConfig.delay) {
          setTimeout(function () {
            callback && callback(data);
          }, simpleConfig.delay);
        } else {
          callback && callback(data);
        }
      }

      return true;
    };
  }

  var mockConfig = {
    call: {}
  };

  // mock rpc
  mockConfig.call.rpc = function (opts, callback) {
    var type = opts.operationType;
    call('rpc', type)(opts, callback);
  };

  // mock 其他容器 api
  var jsapis = simpleConfig.jsapis || handleJsapis(requireContext);
  jsapis.forEach(function (name) {
    mockConfig.call[name] = call('jsapi', name);
  });

  for (var key in mockConfig.call) {
    // 使用真实接口，但是显示 log。用于 模拟器/真机 调试
    simpleConfig.useRealButLog && (mockConfig.call[key] = false);
  }

  mockConfig.forbidAll = simpleConfig.forbidAll;
  mockConfig.disableLog = simpleConfig.disableLog;
  mockConfig.rpcMockList = simpleConfig.rpcMockList;

  // 一般本地chrome开发时会打开此项配置，说明页面运行在一般的浏览器中，此时会自动mock一些容器API，触发AlipayJSBridgeReady事件，mock全局变量AlipayJSBridge
  // 但是如果安装了luna-devtools，会自动识别到是在浏览器中运行，因此就不用打开了。
  // 默认此项关闭，会通过UserAgent来猜测是否页面运行于Nebula中，如果页面运行在钱包容器中，不会自动mock，只会应用本配置文件中自定义的mock
  // mockConfig.runInBrowser = true;

  window.lunaMockConfig = mockConfig;
}

module.exports = lunaMockSimpleConfig;