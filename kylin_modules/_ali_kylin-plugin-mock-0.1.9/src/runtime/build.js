import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

export default function generateBuildImpl(configPath) {
  
  return function webpackModifyImpl(webpackConfig) {

    const workingDir = path.dirname(configPath);
    const jsapiContextDir = path.resolve( workingDir, './jsapi/' );
    const rpcContextDir = path.resolve( workingDir, './rpc/' );

    let useContext = {
      jsapi: false,
      rpc: false
    };

    try {
      useContext.jsapi = fs.lstatSync( jsapiContextDir ).isDirectory();
    } catch(ex) {}
    try {
      useContext.rpc = fs.lstatSync( rpcContextDir ).isDirectory();
    } catch(ex) {}

    webpackConfig.plugins.unshift(
      new webpack.DefinePlugin({
        __KYLIN_PLUGIN_LUNA_MOCK_CONFIG__: JSON.stringify(configPath),
        __KYLIN_PLUGIN_LUNA_MOCK_WORKING_DIR__: JSON.stringify( workingDir ),
        __KYLIN_PLUGIN_LUNA_MOCK_CONTEXT_JSAPI__: JSON.stringify(useContext.jsapi ? `./context/jsapi.js` : `./context/noop.js`),
        __KYLIN_PLUGIN_LUNA_MOCK_CONTEXT_RPC__: JSON.stringify(useContext.rpc ? `./context/rpc.js` : `./context/noop.js`),
        // ...
      })
    )

    return webpackConfig;
  }
}