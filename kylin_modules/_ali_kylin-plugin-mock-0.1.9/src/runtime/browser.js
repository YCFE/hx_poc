// 需要在这里加载 mock.config.js
let lunaMockSimpleConfig;
try {
  lunaMockSimpleConfig = require(__KYLIN_PLUGIN_LUNA_MOCK_CONFIG__);
  if ( lunaMockSimpleConfig && lunaMockSimpleConfig.__esModule ) {
    lunaMockSimpleConfig = lunaMockSimpleConfig.default;
  }
} catch(ex) {

}

// 如果有返回值，且 （window上无lunaMockConfig 或 有空lunaMockConfig)
// 进行simpleConfig处理，并提供 requireContext
if ( lunaMockSimpleConfig && 
  (
    !window.lunaMockConfig || isModuleEmpty(window.lunaMockConfig)
  )
) {
  try {
    const SimpleConfigParser = require('@alipay/luna-mock-webpack-config');

    const context = {
      rpc: require(__KYLIN_PLUGIN_LUNA_MOCK_CONTEXT_RPC__),
      jsapi: require(__KYLIN_PLUGIN_LUNA_MOCK_CONTEXT_JSAPI__)
    };

    const contextCache = {
      get rpcContext() {
        return context.rpc.context;
      },
      get jsapiContext() {
        return context.jsapi.context;
      }
    };

    SimpleConfigParser(lunaMockSimpleConfig, contextCache);
   
  } catch(ex) {
    console.error(`@alipay/luna-mock-webpack-config 解析错误`, ex);
  }
}

const lunaMockCore = require('@alipay/luna-mock/dist/index.js');


export default function loadPlugin(kylinFramework) {

  // nothing 不需要做
}

function isModuleEmpty(obj) {
  if ( !lunaMockSimpleConfig ) {
    return true;
  }

  const ownKeyList = Object.getOwnPropertyNames(obj);
  const keyList = Object.keys(obj);

  return ownKeyList.length === 0 && keyList.length === 0;
}