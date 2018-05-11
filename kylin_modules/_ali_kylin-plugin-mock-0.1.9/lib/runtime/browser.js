'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadPlugin;

var lunaMockSimpleConfig = void 0;
try {
  lunaMockSimpleConfig = require(__KYLIN_PLUGIN_LUNA_MOCK_CONFIG__);
  if (lunaMockSimpleConfig && lunaMockSimpleConfig.__esModule) {
    lunaMockSimpleConfig = lunaMockSimpleConfig.default;
  }
} catch (ex) {}

if (lunaMockSimpleConfig && (!window.lunaMockConfig || isModuleEmpty(window.lunaMockConfig))) {
  try {
    var SimpleConfigParser = require('@alipay/luna-mock-webpack-config');

    var context = {
      rpc: require(__KYLIN_PLUGIN_LUNA_MOCK_CONTEXT_RPC__),
      jsapi: require(__KYLIN_PLUGIN_LUNA_MOCK_CONTEXT_JSAPI__)
    };

    var contextCache = {
      get rpcContext() {
        return context.rpc.context;
      },
      get jsapiContext() {
        return context.jsapi.context;
      }
    };

    SimpleConfigParser(lunaMockSimpleConfig, contextCache);
  } catch (ex) {
    console.error('@alipay/luna-mock-webpack-config \u89E3\u6790\u9519\u8BEF', ex);
  }
}

var lunaMockCore = require('@alipay/luna-mock/dist/index.js');

function loadPlugin(kylinFramework) {}

function isModuleEmpty(obj) {
  if (!lunaMockSimpleConfig) {
    return true;
  }

  var ownKeyList = Object.getOwnPropertyNames(obj);
  var keyList = Object.keys(obj);

  return ownKeyList.length === 0 && keyList.length === 0;
}
//# sourceMappingURL=browser.js.map