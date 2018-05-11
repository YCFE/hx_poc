'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.babelConfig = babelConfig;
exports.babelConfigFactory = babelConfigFactory;

var _getBabelCommonConfig = require('../build/config/getBabelCommonConfig');

var _getBabelCommonConfig2 = _interopRequireDefault(_getBabelCommonConfig);

var _options = require('./options');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 输入选项
 * @param options
 */
/**
 * 使用方
 * import { babelConfig, babelConfigFactory } from '@ali/kylin-build/lib/config/babel';
 */

function babelConfig(params) {
  params = (0, _options.userOption)(params);
  var _params = params;
  const options = _params.options;


  return (0, _getBabelCommonConfig2.default)({}, {
    options: options
  });
}

/**
 * 输入原来的bc和选项
 * @param wc
 * @param options
 */
function babelConfigFactory(bc, params) {
  params = (0, _options.userOption)(params);
  var _params2 = params;
  const options = _params2.options;

  // 开始进行改造

  bc.presets = bc.presets || [];
  bc.plugins = bc.plugins || [];

  // 处理公共JSX写法
  compactJSX(bc, params);

  // 处理decorator, class-properties 公用
  compactDecorator(bc, params);

  compactES2015(bc, params);

  return bc;
}

function compactES2015(bc, params) {
  const options = params.options;


  if (params.forceES2015Nebula) {
    // 移除 es2015 preset, 加上nebula preset
    bc.presets.forEach(function (preset, index) {
      const presetName = typeof preset === 'string' ? preset : preset[0];
      const isES2015 = /es2015/i.test(presetName);

      if (isES2015) {
        bc.presets.splice(index, 1);
      }
    });

    bc.presets.push([require.resolve('@ali/babel-preset-es2015-nebula'), {
      enableTypeofSymbol: options.enableTypeofSymbol,
      enableGenerator: options.enableGenerator,
      enableForOfArray: options.enableForOfArray,
      nebulaTarget: options.nebulaTarget,
      loose: options.enableES6LooseTrue,
      preferExternalPromise: options.preferExternalPromise
    }]);
  }
}

function compactJSX(bc, params) {

  let hasReactTransform = false;
  bc.presets.forEach(function (preset, index) {
    const presetName = typeof preset === 'string' ? preset : preset[0];
    const isReact = /react/i.test(presetName);

    hasReactTransform = hasReactTransform || isReact;

    if (params.forceVueJSX && isReact) {
      bc.presets.splice(index, 1);
    }
  });
  bc.plugins.forEach(function (plugin, index) {
    const pluginName = typeof plugin === 'string' ? plugin : plugin[0];
    const isReact = /react/i.test(pluginName);

    hasReactTransform = hasReactTransform || isReact;

    if (params.forceVueJSX && isReact) {
      bc.plugins.splice(index, 1);
    }
  });

  // 如果react不存在，或者已经被移除掉了，把vue的加进去
  if (!hasReactTransform || params.forceVueJSX) {
    bc.plugins.push([require.resolve('babel-plugin-transform-vue-jsx')]);
  }
}

function compactDecorator(bc, params) {
  const options = params.options;


  if (options.enableDecorator) {
    let hasDecorator = false;
    // 兼容一下装饰器
    bc.plugins.forEach(function (plugin, index) {
      const pluginName = typeof plugin === 'string' ? plugin : plugin[0];

      const isDecoratorsLegacy = /babel-plugin-transform-decorators-legacy/i.test(pluginName);
      const isClassProperties = /babel-plugin-transform-class-properties/i.test(pluginName);

      // 移除decorator
      if (isDecoratorsLegacy || isClassProperties) {
        bc.plugins.splice(index, 1);
        hasDecorator = true;
      }
    });

    // 不管有没有，全要加，先把之前的移除掉
    if (true) {
      bc.plugins = bc.plugins.concat([options.enableDecoratorInject ? [require.resolve("@ali/babel-plugin-decorators-inject"), {
        className: 'Component',
        PropertyName: 'Property',
        propertyIgnoreName: 'Property',
        enableComponentLazyRequire: options.enableComponentLazyRequire,
        enableRenderInjectH: false, // 使用vue的注入
        injectComponentName: options.enableInjectComponentName
      }] : null, require.resolve("babel-plugin-transform-decorators-legacy"), require.resolve('babel-plugin-transform-class-properties')].filter(Boolean));
    }
  }
}