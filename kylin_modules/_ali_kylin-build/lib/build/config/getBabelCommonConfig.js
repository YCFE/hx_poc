'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBabelCommonConfig;

var _os = require('os');

var _index = require('../plugin-loader/index');

function getBabelCommonConfig(program, kylinApp) {
  var _kylinApp$options = kylinApp.options;
  const enableTypeofSymbol = _kylinApp$options.enableTypeofSymbol,
        enableGenerator = _kylinApp$options.enableGenerator,
        enableForOfArray = _kylinApp$options.enableForOfArray,
        nebulaTarget = _kylinApp$options.nebulaTarget,
        enableDecoratorInject = _kylinApp$options.enableDecoratorInject,
        enableComponentLazyRequire = _kylinApp$options.enableComponentLazyRequire,
        enableDecorator = _kylinApp$options.enableDecorator,
        enableES6LooseTrue = _kylinApp$options.enableES6LooseTrue,
        preferExternalPromise = _kylinApp$options.preferExternalPromise,
        enableInjectComponentName = _kylinApp$options.enableInjectComponentName,
        enableAsync = _kylinApp$options.enableAsync,
        enableES6LoosePolyfill = _kylinApp$options.enableES6LoosePolyfill,
        compileComponent = _kylinApp$options.compileComponent,
        compileComponentStrict = _kylinApp$options.compileComponentStrict,
        hoistFunctions = _kylinApp$options.hoistFunctions;


  const isProject = program.type === 'project';
  const componentMinify = program.type === 'component' && program.compress;

  let retBabelConfig = {
    babelrc: false,
    // cacheDirectory: tmpdir(),
    presets: [
    /*
     * if we want to transpile async to promise (not generator) with 'fast-async',
     * we need disable transform-async-generator-function and transform-async-to-generator
     * which in babel-preset-stage-3 ...
     * so we have to maintain the preset list self.
     */
    enableAsync ? null : require.resolve('babel-preset-stage-0'), [require.resolve('@ali/babel-preset-es2015-nebula'), {
      enableTypeofSymbol: enableTypeofSymbol,
      enableGenerator: enableGenerator,
      enableForOfArray: enableForOfArray,
      nebulaTarget: nebulaTarget,
      loose: enableES6LooseTrue,
      requeue: false,
      preferExternalPromise: preferExternalPromise,
      ensureExitPromise: true,
      loosePolyfill: enableES6LoosePolyfill && isProject // 必须project才能开启，否则组件项目会出现无路径无引用
    }]].filter(Boolean),
    plugins: [kylinApp.options.componentImport ? [require.resolve("babel-plugin-import"), kylinApp.options.componentImport] : null, require.resolve("babel-plugin-transform-vue-jsx"), enableDecoratorInject ? [require.resolve("@ali/babel-plugin-decorators-inject"), {
      className: 'Component',
      PropertyName: 'Property',
      propertyIgnoreName: 'Property',
      enableComponentLazyRequire: enableComponentLazyRequire,
      enableRenderInjectH: false, // 使用vue的注入
      injectComponentName: enableInjectComponentName
    }] : '', enableDecoratorInject && compileComponent ? [require.resolve("@ali/babel-plugin-decorators-component"), {
      strict: compileComponentStrict
    }] : '', enableDecorator ? require.resolve("babel-plugin-transform-decorators-legacy") : '', require.resolve('babel-plugin-transform-class-properties'), enableAsync ? [require.resolve("@ali/babel-plugin-fast-async"), {
      spec: true,
      useRuntimeModule: false,
      // hoist true 且 compress = false 时才开启hoistFuns进行提升
      // 不影响生产的uglify输出，只影响dev下的syntax
      hoistFuns: hoistFunctions && !program.compress
    }] : null].concat(enableAsync ? [
    // stage 0
    require.resolve('babel-plugin-transform-do-expressions'), require.resolve('babel-plugin-transform-function-bind'),
    // stage 1
    require.resolve('babel-plugin-transform-class-constructor-call'), require.resolve('babel-plugin-transform-export-extensions'),
    // stage 2
    require.resolve('babel-plugin-transform-class-properties'), require.resolve('babel-plugin-transform-decorators'), require.resolve('babel-plugin-syntax-dynamic-import'),
    // stage 3
    require.resolve('babel-plugin-syntax-trailing-function-commas'),
    // require.resolve('babel-plugin-transform-async-generator-functions'),
    // require.resolve('babel-plugin-transform-async-to-generator'),
    require.resolve('babel-plugin-transform-exponentiation-operator'), require.resolve('babel-plugin-transform-object-rest-spread')] : []).filter(Boolean)
  };

  if (componentMinify) {
    retBabelConfig = Object.assign({
      "minified": true,
      "comments": false
    }, retBabelConfig);
    retBabelConfig.plugins.push(require.resolve("babel-plugin-minify-mangle-names"));
  }

  // 开始修改 babel
  retBabelConfig = (0, _index.applyPluginForBabel)(retBabelConfig, kylinApp);

  return retBabelConfig;
}
module.exports = exports['default'];