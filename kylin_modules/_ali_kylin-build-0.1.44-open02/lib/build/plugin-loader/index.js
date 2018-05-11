'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasPluginId = hasPluginId;
exports.applyPluginForBabel = applyPluginForBabel;
exports.applyPluginForWebpack = applyPluginForWebpack;
exports.applyPluginForResource = applyPluginForResource;
exports.loadPlugin = loadPlugin;

var _index = require('../../utils/index.js');

var _globalResource = require('../plugin/globalResource');

var globalResource = _interopRequireWildcard(_globalResource);

var _resolve = require('./resolve');

var _browserInject = require('./browser-inject');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 既支持callback， 又支持直接返回值
function* callAsyncFunction(func, args) {

  return new Promise(function (resolve) {

    const ret = func.apply(null, args.concat(function callback(ret) {

      resolve(ret);
    }));

    if (ret) {
      resolve(ret);
    }
  });
}

function hasPluginId(program, kylinApp, key) {
  const ret = kylinApp.parsedPlugins.filter(d => d.pluginName === key).length > 0;

  return ret;
}

function applyPluginForBabel(babelConfig, kylinApp) {
  kylinApp.parsedPlugins = kylinApp.parsedPlugins || [];
  // 开始挨个生效plugin
  for (let pluginObj of kylinApp.parsedPlugins) {

    let ignore = false;
    const pluginExports = pluginObj.exports;
    if (!pluginExports) {
      ignore = true;
    }

    // 这里操作webpack部分
    const babelFunc = pluginObj.exports.babel;

    if (!babelFunc) {
      ignore = true;
    }

    if (ignore) {
      // hint.warn('[Plugin]', `[babel-config] "${pluginObj.name}" [Ignored]`);
      continue;
    } else {
      _index.hint.success('[Plugin]', `[babel-config] "${pluginObj.name}" [Applied]`);
    }

    const retBabelConfig = babelFunc.call(null, babelConfig);

    // 以免原地修改没有返回值
    babelConfig = retBabelConfig ? retBabelConfig : babelConfig;
  }

  return babelConfig;
}

function* applyPluginForWebpack(webpackConfig, kylinApp) {

  // 开始挨个生效plugin
  for (let pluginObj of kylinApp.parsedPlugins) {

    let ignore = false;
    const pluginExports = pluginObj.exports;
    if (!pluginExports) {
      ignore = true;
    }

    // 这里操作webpack部分
    const webpackFunc = pluginObj.exports.webpack;

    if (!webpackFunc) {
      ignore = true;
    }

    if (ignore) {
      // hint.warn('[Plugin]', `[webpack-config] "${pluginObj.name}" [Ignored]`);
      continue;
    } else {
      _index.hint.success('[Plugin]', `[webpack-config] "${pluginObj.name}" [Applied]`);
    }

    const retWebpackConfig = yield callAsyncFunction(webpackFunc, [webpackConfig]);

    // 以免原地修改没有返回值
    webpackConfig = retWebpackConfig ? retWebpackConfig : webpackConfig;
  }

  webpackConfig = (0, _browserInject.applyInject)(webpackConfig, kylinApp);

  return webpackConfig;
}

function applyPluginForResource(globalResource, kylinApp, program) {

  for (let pluginObj of kylinApp.parsedPlugins) {

    let ignore = false;
    const pluginExports = pluginObj.exports;
    if (!pluginExports) {
      ignore = true;
    }

    // 这里操作webpack部分
    const resourceFunc = pluginObj.exports.resource;

    if (!resourceFunc || typeof resourceFunc !== 'function') {
      ignore = true;
    }

    if (ignore) {
      // hint.warn('[Plugin]', `[resource] "${pluginObj.name}" [Ignored]`);
      continue;
    } else {
      _index.hint.success('[Plugin]', `[resource] "${pluginObj.name}" [Applied]`);
    }

    try {
      // 做一定的修改，需要保持住引用对象
      resourceFunc.call(null, globalResource, kylinApp, program);
    } catch (ex) {
      _index.hint.error('[Plugin]', 'Resource Modify Error' + ex.toString() + ex.stack);
    }
  }
}

function findPluginMatch(re, plugins) {
  return plugins.filter(p => typeof p === 'string' ? re.test(p) : Array.isArray(p) ? re.test(p[0]) : false);
}

function loadPlugin(program, kylinApp) {

  let plugins = kylinApp.plugins || [];

  if (!Array.isArray(plugins)) {
    plugins = [];
    _index.hint.error("[Plugin]", "kylinApp.plugins is not an array, will be ignore");
  }

  // 添加vue资源注入
  if (findPluginMatch(/vue/, plugins).length === 0) {
    plugins.push('vue');
  }
  // 修改mock配置
  if (findPluginMatch(/mock/, plugins).length === 0) {
    plugins.push('mock');
  }
  // 默认添加性能埋点
  if (findPluginMatch(/perflog/, plugins).length === 0) {
    plugins.push('perflog');
  }

  // 预处理是否有option的情况
  plugins = plugins.map((obj, index) => {
    let ret = {};

    if (typeof obj === 'string') {

      ret.name = obj;
      ret.option = undefined;
    } else if (Array.isArray(obj)) {
      ret.name = obj[0];
      ret.option = obj[1];
    } else {
      _index.hint.error("[Plugin]", `kylinApp.plugins[${index}] can not be recognized`);
    }

    return ret;
  }).filter(d => d.name);

  // 然后开始resolve module
  plugins.forEach((obj, index) => {

    _index.hint.success("[Plugin]", `[loading] "${obj.name}"`);
    // 如果报错，直接抛出来
    obj.modulePath = (0, _resolve.resolvePlugin)(obj.name, program.cwd);
    obj.exports = require(obj.modulePath);
    obj.pluginName = obj.exports.default && obj.exports.default.pluginName || obj.exports.pluginName;
    obj.exports = obj.exports.default || obj.exports;

    if (typeof obj.exports === 'function') {
      obj.exports = obj.exports.call(null, { program: program, kylinApp: kylinApp, hint: _index.hint }, obj.option);
    }
  });

  // 已经完成 package处理了
  kylinApp.parsedPlugins = plugins;
  applyPluginForResource(globalResource, kylinApp, program);
}