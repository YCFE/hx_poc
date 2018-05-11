"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = server;

var _index = require("../../utils/index");

var _entry = require("./entry");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _urllib = require("urllib");

var _urllib2 = _interopRequireDefault(_urllib);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _opn = require("opn");

var _opn2 = _interopRequireDefault(_opn);

var _lsof = require("lsof");

var _lsof2 = _interopRequireDefault(_lsof);

var _lunaInjectMock = require("../plugin/lunaInjectMock");

var _lunaInjectMock2 = _interopRequireDefault(_lunaInjectMock);

var _kylinI18NLoaderPlugin = require("../plugin/kylinI18NLoaderPlugin");

var _kylinI18NLoaderPlugin2 = _interopRequireDefault(_kylinI18NLoaderPlugin);

var _index2 = require("../plugin-loader/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* server(program, kylinApp) {

  // 1. 先判断 nebulaTarget
  const options = kylinApp.options;
  const nebulaTargetArr = options.nebulaTargetArr,
        nebulaTarget = options.nebulaTarget,
        originalNebulaTarget = options.originalNebulaTarget;


  let expectTarget = nebulaTargetArr[0] || 'common';
  if (nebulaTargetArr.length > 1) {
    // 如果指定了多个合法nebulaTarget，在开启server的时候，按照第0项执行
    _index.hint.warn(`[Warn]`, `--server does not support multiple "nebulaTarget", will treat as "${expectTarget}"`);
  }

  yield startServer(program, kylinApp, {
    target: expectTarget
  });
}

function* startServer(program, kylinApp, option) {
  const target = option.target;


  kylinApp.options.nebulaTarget = target;

  console.log();
  (0, _index.hint)('[Server]', `NODE_ENV = ${process.env.NODE_ENV}`);
  (0, _index.hint)('[Server]', `nebulaTarget = ${target}`);
  (0, _index.hint)('[Server]', `port = ${kylinApp.devPort}`);

  const webpackConfigFactory = program.prod ? require('./webpack.project.prod.conf') : require('./webpack.project.dev.conf');
  const webpackConfig = yield webpackConfigFactory(program, kylinApp, {
    assetsRoot: '/'
  });
  webpackConfig.entry = (0, _entry.getEntry)(program, kylinApp);
  webpackConfig.watch = true;

  // 只有server && hot 时才开启热更新
  if (program.hot) {
    Object.keys(webpackConfig.entry).forEach(function (name) {
      webpackConfig.entry[name] = [_path2.default.resolve(__dirname, './server-client')].concat(webpackConfig.entry[name]);
    });
  }

  let app = (0, _express2.default)();

  app = yield useMiddleware(program, kylinApp, {
    webpackConfig: webpackConfig,
    webpackWorkerConfig: null
  })(app);

  app = injectHttps(program, kylinApp, app);

  yield appListen(program, kylinApp, {
    app: app,
    port: kylinApp.devPort,
    address: '0.0.0.0'
  });

  _index.hint.success(`\n[Success]`, `listen at ${kylinApp.devPort}`);

  const bindDomain = yield getHpmDomain(program, kylinApp);
  _index.hint.success(`\n[Success]`, `hpm domain: ${bindDomain}:${kylinApp.devPort}`);

  yield tryDevOpenUrl(program, kylinApp, {
    bindDomain: bindDomain
  });
}

function* appListen(program, kylinApp, _ref) {
  let app = _ref.app,
      port = _ref.port;
  var _ref$address = _ref.address;
  let address = _ref$address === undefined ? '0.0.0.0' : _ref$address;


  return new Promise(function (resolve, reject) {

    // address:
    // 见 http://gitlab.alipay-inc.com/kylin/build/issues/2
    app.listen(port, address, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function getEntryUrl(program, kylinApp, _ref2) {
  let entry = _ref2.entry,
      domain = _ref2.domain;


  let entryKey;
  if (entry === true) {
    entryKey = Object.keys(kylinApp.pages || {})[0];
  } else {
    entryKey = kylinApp.pages[entry] ? entry : undefined;
  }

  if (entryKey) {
    return `${domain}:${kylinApp.devPort}/${entryKey}.html`;
  } else if (entry !== undefined) {
    _index.hint.error(`[Error]`, entry === true ? `kylinApp.pages is empty` : `specific entry [${entry}] not found in kylinApp.pages`);
    return;
  }
}

function* tryDevOpenUrl(program, kylinApp, _ref3) {
  let bindDomain = _ref3.bindDomain;


  const openUrl = getEntryUrl(program, kylinApp, {
    entry: program.open,
    domain: bindDomain
  });

  const qrcodeUrl = getEntryUrl(program, kylinApp, {
    entry: program.qrcode,
    domain: bindDomain
  });

  const simUrl = getEntryUrl(program, kylinApp, {
    entry: program.sim,
    domain: bindDomain
  });

  if (openUrl) {
    _index.hint.success(`[Tool]`, `opening [${openUrl}]`);
    (0, _opn2.default)(openUrl);
  }
  if (qrcodeUrl) {
    if (program.hpmDomain) {
      _index.hint.success(`[Tool]`, `opening [${qrcodeUrl}] for qrcode`);
      (0, _opn2.default)(`http://qr.liantu.com/api.php?text=${encodeURIComponent(qrcodeUrl)}`);
      // https://chart.googleapis.com/chart?cht=qr&chs=200×200&choe=UTF-8&chld=L|4&chl=http://Codeup.org
      // 还有一个googleapi备份
    } else {
      _index.hint.error(`[Error]`, `--qrcode should be used with --domain`);
    }
  }
  if (simUrl) {
    yield openInHpmSimStart(program, kylinApp, {
      simUrl: simUrl
    });
  }
}

function* openInHpmSimStart(program, kylinApp, _ref4) {
  let simUrl = _ref4.simUrl;

  const cmd = `hpm sim start ${simUrl}`;
  (0, _index.hint)(`[Hpm] exec '${cmd}'`);
  const ret = yield (0, _index.exec)(cmd, {
    slient: true
  });
  console.log(ret.stdout);
}

function injectHttps(program, kylinApp, app) {
  if (kylinApp.useHttps) {
    return _https2.default.createServer({
      key: _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../cert/server.key')),
      cert: _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../cert/server.crt'))
    }, app);
  } else return app;
}

function getLocalIP() {
  let distance = 999999;
  const ipList = [];
  let result;

  const ifaces = _os2.default.networkInterfaces();

  for (let i in ifaces) {
    let ips = ifaces[i];
    while (ips.length) {
      let ip = ips.pop();
      if (ip.family === 'IPv4' && ip.address != '127.0.0.1') {
        ipList.push(ip.address);
      }
    }
  }

  //离10.x网段最近的ip
  ipList.forEach(function (ip) {
    const ipPrefix = parseInt(ip);
    if (ipPrefix - 10 < distance) {
      result = ip;
      distance = ipPrefix - 10;
    }
  });

  return result;
}

function* getHpmDomain(program, kylinApp) {

  // 只有开启domain才会生成
  if (program.hpmDomain) {

    // const interfaces = os.networkInterfaces();
    // // 家里vpn，访问不了这个域名，deprecated
    // const utun0 = interfaces && interfaces.utun0 || [];
    // // 公司局域网
    // const en0 = interfaces && interfaces.en0 || [];

    // 如果存在 en0 网卡, 且有 IPv4地址
    const ipv4address = getLocalIP();

    if (ipv4address) {
      try {
        const resp = yield _urllib2.default.request(`http://nodejs.inc.alipay.net:4567/getDomain?ip=${ipv4address}&type=alipay`, {
          method: 'GET',
          timeout: 10000,
          dataType: 'json'
        });

        if (resp.status + '' == '200') {
          if (resp.data.domain) {
            return (kylinApp.useHttps ? `https://` : `http://`) + resp.data.domain;
          }
        }
      } catch (ex) {
        //hint.error(`[Warn]`, ex.message);
      }
    }
  }
  return kylinApp.useHttps ? `https://debug127000000001.local.alipay.net` : `http://localhost`;
}

function useMiddleware(program, kylinApp, option) {

  return function* (app) {

    app.use('/', function (req, res, next) {
      (0, _index.hint)(`[Server]`, `${req.get('Host')}${req.url}`);
      next();
    });

    let webpackConfig = option.webpackConfig,
        webpackWorkerConfig = option.webpackWorkerConfig;


    if (!(0, _index2.hasPluginId)(program, kylinApp, "@ali/kylin-plugin-i18n")) {
      webpackConfig = (0, _kylinI18NLoaderPlugin2.default)(program, kylinApp, webpackConfig);
    }
    if (!(0, _index2.hasPluginId)(program, kylinApp, "@ali/kylin-plugin-mock")) {
      webpackConfig = (0, _lunaInjectMock2.default)(program, kylinApp, webpackConfig);
    }

    try {
      webpackConfig = yield (0, _index2.applyPluginForWebpack)(webpackConfig, kylinApp);
    } catch (ex) {
      _index.hint.error(`[Config]`, `applying plugin for webpack phase error`);
      _index.hint.error(`[Config]`, ex);
      throw ex;
    }

    const wcPath = _path2.default.resolve(program.cwd, kylinApp.options.defaultWebpackConfigFactoryPath);
    try {

      if (_fs2.default.existsSync(wcPath)) {
        const webpackConfigDefineFactory = require(wcPath);
        if (typeof webpackConfigDefineFactory === 'function') {
          webpackConfig = webpackConfigDefineFactory(webpackConfig) || webpackConfig;
        } else {
          _index.hint.error(`[Config]`, `webpack.config is not function with path [${wcPath}]`);
        }
      }
    } catch (ex) {
      _index.hint.error(`[Config]`, `webpack.config process error with path [${wcPath}]`);
      _index.hint.error(`[Config]`, ex);
    }

    // devMiddleware
    const compiler = (0, _webpack2.default)(webpackConfig);
    const devMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: '/',
      noInfo: false,
      watchOptions: {
        aggregateTimeout: 300,
        poll: true
      },
      stats: {
        colors: true,
        modules: !!program.verbose,
        children: !!program.verbose,
        chunks: !!program.verbose,
        chunkModules: !!program.verbose
      }
    });

    // app.use('/', function (req, res, next) {
    //   hint(`[Server:after-dev]`, `${req.get('Host')}${req.url}`);
    //   next();
    // });

    // hotMiddleware
    const hotMiddleware = require('webpack-hot-middleware')(compiler);
    if (kylinApp.options.enableRefresh) {
      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
          hotMiddleware.publish({ action: 'reload' });
          (0, _index.hint)(`[Hot]`, `reload emit`);
          cb();
        });
        compilation.plugin('html-webpack-plugin-alter-chunks', function (chunks, htmlPlugin) {
          hotMiddleware.publish({ action: 'reload' });
          (0, _index.hint)(`[Hot]`, `reload chunks`);
          return chunks;
        });
      });
    }

    // history-api
    app.use(require('connect-history-api-fallback')());
    app.use(devMiddleware);
    app.use(hotMiddleware);
    // let workerCompiler = null;
    // const externalMap = getExternalEntry(kylinApp);
    // if( externalMap && Object.keys(externalMap).length > 0 ){
    //
    //   // var workerWebpackConfig = webPackForWorker(externalMap, projectRoot);
    //   // workerCompiler = webpack(Object.assign(workerWebpackConfig,{
    //   //   watch: true,
    //   //   // eval-source-map is faster for development
    //   //   devtool: '#source-map',
    //   // }))
    // }
    return app;
  };
}
module.exports = exports["default"];