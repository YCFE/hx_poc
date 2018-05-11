'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntry = getEntry;
exports.getExternalEntry = getExternalEntry;
exports.getHtmlPluginArrayWithNunjucks = getHtmlPluginArrayWithNunjucks;
exports.getHtmlPluginArray = getHtmlPluginArray;
exports.getHtmlPluginArrayWithReplace = getHtmlPluginArrayWithReplace;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _template = require('./template');

var _utils = require('../../utils');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEntry(program, kylinApp) {
  const entryMap = {};

  if (kylinApp.pages) {
    for (let key in kylinApp.pages) {
      entryMap[key] = [kylinApp.pages[key].entry];
    }
  }

  return entryMap;
}

function getExternalEntry(program, kylinApp) {
  let entryMap = null;
  // externalEntry
  if (kylinApp.externalEntry) {
    entryMap = Object.assign({}, kylinApp.externalEntry);
  }
  return entryMap;
}

function* getHtmlPluginArrayWithNunjucks(program, kylinApp) {
  const HtmlPluginArray = [];

  const prodConfig = {
    minify: {
      removeComments: false,
      collapseWhitespace: true,
      removeAttributeQuotes: false
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  };

  const render = (0, _template.getRender)(program, kylinApp);

  if (kylinApp.pages) {

    // 读取每个pages里面指定的template
    for (var key in kylinApp.pages) {
      if (kylinApp.pages[key]['index']) {
        _utils.hint.warn(`[package.json]`, `'kylinApp.pages["${key}"].index' is ${_chalk2.default.yellow('Deprecated')}, use 'kylinApp.pages["${key}"].template' instead`);
      }
      let index = kylinApp.pages[key]['template'] || kylinApp.pages[key]['index'] || kylinApp.pageTemplate;
      let data = kylinApp.pages[key]['data'];

      const resPath = _path2.default.resolve(program.cwd, index);
      const dataStr = JSON.stringify({ [resPath]: data });
      const templateResolveStr = `${require.resolve('../plugin/nunjucks-loader')}!${require.resolve('../plugin/nunjucks-template-loader')}?data=${dataStr}!${resPath}`;

      // 根据 options 设置一下页面的输出name
      const filename = kylinApp.pages[key]['html'] || kylinApp.options.htmlOutputName.replace('[entry]', `${key}`);

      let options = {
        filename: filename,
        template: templateResolveStr,
        inject: true,
        chunks: [key]
      };

      if (program.prod) {
        options = Object.assign(options, prodConfig);
        options.chunks.push('common');
      }
      HtmlPluginArray.push(new _htmlWebpackPlugin2.default(options));
    }
  }

  return HtmlPluginArray;
}

function* getHtmlPluginArray(program, kylinApp) {
  if (kylinApp.options.enableTemplateNunjucks) {
    return yield getHtmlPluginArrayWithNunjucks(program, kylinApp);
  } else {
    return yield getHtmlPluginArrayWithReplace(program, kylinApp);
  }
}

function* getHtmlPluginArrayWithReplace(program, kylinApp) {
  let HtmlPluginArray = [];

  var prodConfig = {
    minify: {
      removeComments: false,
      collapseWhitespace: true,
      removeAttributeQuotes: false
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  };

  // TODO 做成模板编译机制
  if (kylinApp.pages && kylinApp.pageTemplate) {
    // 读取template string
    const content = _fs2.default.readFileSync(_path2.default.join(program.cwd, kylinApp.pageTemplate)).toString();
    for (var key in kylinApp.pages) {
      let index = kylinApp.pages[key]['index'];
      let tempContent = content;
      if (index) {
        let indexContent = _fs2.default.readFileSync(_path2.default.join(program.cwd, index));
        tempContent = tempContent.replace('<!--PageContent-->', indexContent.toString());
      }
      let options = {
        filename: `${key}.html`,
        templateContent: tempContent,
        inject: true,
        chunks: [key]
      };
      if (program.prod) {
        options = Object.assign(options, prodConfig);
        options.chunks.push('common');
      }
      HtmlPluginArray.push(new _htmlWebpackPlugin2.default(options));
    }
  } else {
    // https://github.com/ampedandwired/html-webpack-plugin
    let options = {
      filename: 'index.html',
      templateContent: `<html><head><title>页面没有标题</title></head><body>Kylin默认页面</body></html>`,
      inject: true
    };
    if (program.prod) {
      options = Object.assign(options, prodConfig);
      //options.chunks.push('manifest');
    }
    HtmlPluginArray.push(new _htmlWebpackPlugin2.default(options));
  }
  return HtmlPluginArray;
}