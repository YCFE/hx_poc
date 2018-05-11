'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyInject = applyInject;
function applyInject(webpackConfig, kylinApp) {

  // 修改entry
  // 在entry前注入 一段脚本，这段脚本支持通过另一个webpackLoader来进行replace即可
  const parsedPlugins = kylinApp.parsedPlugins;

  if (parsedPlugins.length) {
    const browserPathList = parsedPlugins.map(d => d.exports && d.exports.browser).filter(Boolean);

    const pluginLoaderPath = `!!${require.resolve('./browser-replace-loader.js')}?paths=${encodeURIComponent(JSON.stringify(browserPathList))}!${require.resolve('./browser-entry.js')}`;

    // 假定 webpackConfig.entry 是一个 object
    Object.keys(webpackConfig.entry).forEach(key => {
      const entryVal = webpackConfig.entry[key];
      if (Array.isArray(entryVal)) {
        entryVal.unshift(pluginLoaderPath);
      } else {
        webpackConfig.entry[key] = [pluginLoaderPath, entryVal];
      }
    });
  }

  // console.log('webpackConfig.entry', webpackConfig.entry)

  return webpackConfig;
}