module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules,
  importedComponents
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

    // framework 0.1.3
  var connectV13Enable = typeof options['__kylin_connect_wrap__'] === 'object';

  var connectAutoFunc = null;
  var connectAutoOptions = null;
  if ( connectV13Enable ) {

    connectAutoFunc = options['__kylin_connect_wrap__'].func;
    connectAutoOptions = options['__kylin_connect_wrap__'].options;

    // 强制修改 scriptExports 为 子组件
    scriptExports = options = connectAutoOptions;
  }

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  // 对 <component> 声明的顶级组件进行注入
  if (importedComponents) {
    options.components = options.components || {}
    for (var componentName in importedComponents) {
      if (Object.hasOwnProperty.call(importedComponents, componentName)) {
        if (options.components[componentName]) {
          console && console.warn && console.warn('component block for [' + componentName + '] has conflict key in options.components')
        }
        options.components[componentName] = importedComponents[componentName]
      }
    }
  }

  var connectOptions = null;
  // framework 0.1.2
  if ( typeof options['__kylin_connect_function__'] === 'function' ) {
    connectOptions = options['__kylin_connect_function__']( options );
    scriptExports = options = connectOptions;
  }

  if ( connectV13Enable ) {
    connectOptions = connectAutoFunc( options );
    scriptExports = options = connectOptions;
  }
  // 在 options 上检测是否存在 
  // __kylin_connect_function__ key
  // 如果存在 func 则把最后的 scriptExports提取只剩下options
  // 如果 存在 func，把 scriptExports 传入，拿到新的options

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}
