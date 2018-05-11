'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LunaInjectMockPlugin = LunaInjectMockPlugin;
exports.default = webpackMockConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ConcatSource = require('webpack-core/lib/ConcatSource');

var _ConcatSource2 = _interopRequireDefault(_ConcatSource);

var _index = require('../../utils/index');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mockEntry = '__lunaMock';

function getLunaMock() {
  let content = '';
  const lunaMockPath = require.resolve('@alipay/luna-mock/dist/index.js');
  if (_fs2.default.existsSync(lunaMockPath)) {
    content = _fs2.default.readFileSync(lunaMockPath, { encoding: 'utf8' });
  } else {
    _index.hint.error(`[Mock]`, `mock依赖库 [${_chalk2.default.red(`@alipay/luna-mock/dist/index.js`)}] 未找到`);
  }

  return content;
}

function LunaInjectMockPlugin() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.options = options;
}

LunaInjectMockPlugin.prototype.apply = function (compiler) {

  compiler.plugin('compilation', compilation => {
    compilation.plugin('optimize-chunk-assets', (chunks, callback) => {

      // 其他比如 html-webpack-plugin插入的不需要处理
      const mockEntryChunk = chunks.filter(d => d.name === mockEntry)[0];

      if (!mockEntryChunk) {
        callback();
        return;
      }

      // luna-mock库
      const lunaMockCore = getLunaMock();
      // mock配置
      const mockConfigContent = compilation.assets[mockEntryChunk.files[0]] || '';

      chunks.forEach(chunk => {
        // 如果是mock配置入口则跳过
        if (chunk.name === mockEntry) return;

        chunk.files.filter(file => /.(js)$/.test(file)).forEach(file => {

          compilation.assets[file] = new _ConcatSource2.default(mockConfigContent, '\n', lunaMockCore, '\n', compilation.assets[file]);
        });
      });

      callback();
    });
  });
};

function webpackMockConfig(program, kylinApp, webpackConfig) {

  if (!program.mock) {
    return webpackConfig;
  }

  const mockConfigPath = program.mock === true ? kylinApp.options.defaultLunaMockConfigPath : program.mock;

  const mockConfigFileFullPath = _path2.default.resolve(program.cwd, mockConfigPath);

  if (!_fs2.default.existsSync(mockConfigFileFullPath)) {
    _index.hint.error(`[Mock]`, `${_chalk2.default.red(`没有找到`)} [${_chalk2.default.red(mockConfigFileFullPath)}] ${_chalk2.default.red(`，将使用默认配置，无法使用自定义mock功能，`)}\n请参考${_chalk2.default.yellow(`http://gitlab.alipay-inc.com/luna/luna-mock/blob/master/demo/mock.config.js`)}`);
  } else {
    webpackConfig.entry[mockEntry] = [mockConfigFileFullPath];
  }

  // 原来的配置中自动注入mock执行脚本
  webpackConfig.plugins.push(new LunaInjectMockPlugin());

  return webpackConfig;
}