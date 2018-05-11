'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = kylinOptions;

var _utils = require('../../utils');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function warnForPerformance(options) {

  if (options.enableTypeofSymbol) {
    _utils.hint.warn(`[Warn]`, `enableTypeofSymbol=true 会使用大量babel-pollify增大包体积并且降低运行性能`);
  }

  if (options.enableForOfArray) {
    _utils.hint.warn(`[Warn]`, `enableForOfArray=true 会使用大量babel-pollify增大包体积并且降低运行性能`);
  }
}

function kylinOptions() {
  let originalOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  // 默认值在这里
  const kylinAppOptionsDefault = {
    // for project
    customVueUrl: '',
    defaultLunaMockConfigPath: './mock/mock.config.js',
    defaultWebpackConfigFactoryPath: './webpack.config.kylin.js',
    defaultLangLib: '@ali/kylin-i18n',
    defaultLangConfigDir: './src/lang/',
    enableTypescript: false,
    enableGenerator: false,
    enableForOfArray: false,
    enableTypeofSymbol: false,
    enableDecoratorInject: true,
    enableComponentLazyRequire: true,
    enableInjectComponentName: true,
    enableDecorator: true,
    enableRefresh: false,
    enableTemplateNunjucks: true,
    hoistFunctions: true,
    enableES6LoosePolyfill: true,
    compileComponent: false,
    compileComponentStrict: true,
    enableES6LooseTrue: {
      'TemplateLiterals': false,
      'Classes': true,
      'ComputedProperties': false,
      'ForOf': false,
      'Spread': true,
      'Destructuring': true,
      'Modules': false
    },
    enableGlobalResourceInject: true,
    preferExternalPromise: true,
    minChunks: undefined,
    enableChunkHashName: process.env.NODE_ENV === 'test' ? false : true,
    htmlOutputName: '[entry].html',
    enableAsync: true,
    preserveWhitespace: true
  };

  const options = Object.assign(kylinAppOptionsDefault, originalOption);

  warnForPerformance(options);

  if (options.enableTypescript) {
    _utils.hint.error(`[Error]`, `[enableTypescript] is not supported now.`);
  }

  // 如果不开启
  //   如果有 pageTemplate, 对每个page生成html，如果每个page指定了额外的index，做文本替换
  //   如果没有 pageTemplate，对每个page都生成一个默认页面
  // 如果开启
  //   对每个page，使用，先用指定的index，再用pageTemplate来传入  template, 如果都没有，生成默认页面
  options.enableTemplateNunjucks = !!options.enableTemplateNunjucks;

  options.originalNebulaTarget = options.nebulaTarget;
  options.nebulaTarget = options.nebulaTarget || 'common';

  // 额外预处理以下 nebulaTarget
  const availableNebulaTargetEnvs = ['common', 'u4', 'ios8', 'ios9'];
  if (!Array.isArray(options.nebulaTarget)) {
    options.nebulaTargetArr = [options.nebulaTarget];
  } else {
    options.nebulaTargetArr = options.nebulaTarget;
  }

  options.nebulaTargetArr = options.nebulaTargetArr.filter(target => availableNebulaTargetEnvs.indexOf(target) > -1);

  if (options.nebulaTargetArr.length === 0) {
    _utils.hint.error('[Error]', `any one in options.originalNebulaTarget ${JSON.stringify(options.originalNebulaTarget)} are invalid.`);
    (0, _utils.hint)('[Message]', `only accept ${JSON.stringify(availableNebulaTargetEnvs)}`);
  }

  // 非布尔值，看是否跟env相等
  if (typeof options.enableGlobalResourceInject !== 'boolean') {
    options.enableGlobalResourceInject = options.enableGlobalResourceInject === process.env.NODE_ENV;
  }

  if (!options.enableGlobalResourceInject) {
    _utils.hint.warn(`[Warn]`, `[GlobalResourceInject] is ${_chalk2.default.red('disabled')}`);
  }

  return options;
}
module.exports = exports['default'];