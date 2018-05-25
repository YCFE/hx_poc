'use strict';
const path = require('path');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageConfig = require('../package.json');

exports.assetsPath = function(_path) {
  const assetsSubDirectory =
    process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function(options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS
      ? [cssLoader, postcssLoader]
      : [cssLoader];

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      });
    } else {
      return ['vue-style-loader'].concat(loaders);
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }

  return output;
};

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    });
  };
};

const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PAGE_PATH = path.resolve(__dirname, '../src/pages');
const COMMON_PATH = path.resolve(__dirname, '../mock/index.js');
const merge = require('webpack-merge');

exports.entries = function() {
  const entryFiles = glob.sync(PAGE_PATH + '/*');
  const map = {};

  entryFiles.forEach(filePath => {
    const path = filePath.substring(filePath.lastIndexOf('/') + 1);
    const filenames = glob.sync(filePath + `/*/*.js`);

    map[path] = {};
    filenames.forEach(el => {
      const filename = el.substring(
        el.lastIndexOf(`/${path}/`) + path.length + 2,
        el.lastIndexOf('/')
      );
      map[path][filename] = el;
    });

    if(process.env.MOCK) {
      map[path]['common'] = COMMON_PATH;
    }
  });

  return map;
};


//多页面输出配置
// 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function() {
  const entryHtml = glob.sync(PAGE_PATH + '/*');
  const map = {};

  entryHtml.forEach(filePath => {
    const path = filePath.substring(filePath.lastIndexOf('/') + 1);
    const filenames = glob.sync(filePath + `/*/*.html`);

    map[path] = [];

    filenames.forEach(el => {
      const filename = el.substring(
        el.lastIndexOf(`/${path}/`) + path.length + 2,
        el.lastIndexOf('/')
      );
      // map[path][filename] = el;
      let conf = {
        // 文件名称
        template: el,
        filename: `${path}/${filename}.html`,
        chunks: ['common', filename],
        inject: true
      };
      if (process.env.NODE_ENV === 'production') {
        conf = merge(conf, {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyJS: true
          },
          chunksSortMode: 'dependency'
        });
      }

      map[path].push(new HtmlWebpackPlugin(conf));
    });
  });

  return map;
};
