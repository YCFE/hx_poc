'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _utils = require('../../utils');

var _kylinOptions = require('../utils/kylinOptions');

var _kylinOptions2 = _interopRequireDefault(_kylinOptions);

var _utils2 = require('../utils');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* init(program) {

  // 1. 预处理 --dev语法糖
  const cwd = program.cwd;


  if (program.dev) {

    _utils.hint.warn('[Dev]', '--dev is Deprecated, please use "--server --no-prod --hot --no-compress" instead of it');
    console.log();

    program.server = true;
    program.prod = false;
    program.hot = true;
    program.compress = false;
  }

  program.sourcemap = (0, _utils2.determineSourcemapType)(program.sourcemap, program.prod);

  process.env.NODE_ENV = process.env.NODE_ENV === 'test' ? process.env.NODE_ENV : program.prod ? 'production' : 'development';

  // 根据cwd情况获取对应config
  let kylinApp = (0, _utils2.determineKylinConfig)(program, 'kylinApp');
  kylinApp = preprocessKylinAppConfig(program, kylinApp);

  // // 2. 做一些公用的预处理
  // const packageJson = require(`${cwd}/package.json`);
  // let kylinApp = packageJson.kylinApp || {};
  // kylinApp = preprocessKylinAppConfig(program, kylinApp);

  if (program.https && !program.server) {
    program.https = false;
    _utils.hint.warn(`[Server]`, `--https only work with ${_chalk2.default.yellow(`--server`)}`);
  }

  if (program.https && !kylinApp.useHttps) {
    kylinApp.useHttps = true;
    _utils.hint.warn(`[Server]`, `--https will force ${_chalk2.default.yellow(`kylinApp.useHttps=true`)}`);
  }

  // 如果开了热更新，声明以下只在server + no-prod时支持
  if (program.hot && (!program.server || program.prod)) {
    program.hot = false;
    _utils.hint.warn('[Warn]', `--hot should be used with --server && --no-prod`);
  }

  if (program.hot) {
    if (kylinApp.options.enableRefresh) {
      _utils.hint.warn(`[Hot]`, `文件变更会触发${_chalk2.default.yellow(`强制刷新`)} (kylinApp.options.enableRefresh=true) `);
    } else {
      _utils.hint.warn(`[Hot]`, `文件变更会触发${_chalk2.default.yellow(`热替换`)} (kylinApp.options.enableRefresh=false) `);
    }
  }

  if (program.qrcode && !program.hpmDomain) {
    program.hpmDomain = true;
    _utils.hint.warn(`[Warn]`, `--qrcode will force --hpm-domain`);
  }

  if (program.sim && !program.hpmDomain) {
    program.hpmDomain = true;
    _utils.hint.warn(`[Warn]`, `--sim will force --hpm-domain`);
  }

  // if ( program.mock && !program.server ) {
  //   program.mock = false;
  //   const errMsg = `--mock only work with --server`;
  //   hint.error(`[Error]`, errMsg);
  //   throw new Error(errMsg);
  // }

  if (_fs2.default.existsSync(_path2.default.resolve(program.cwd, kylinApp.options.defaultWebpackConfigFactoryPath))) {
    _utils.hint.success(`[Config]`, `webpack.config Using [${_chalk2.default.yellow(kylinApp.options.defaultWebpackConfigFactoryPath)}]`);
  }

  var _require = require('../plugin-loader/index.js');

  const loadPlugin = _require.loadPlugin;
  // 开始同步加载插件

  loadPlugin(program, kylinApp);

  // 3. 根据 program.server进行路由,对应config初始化自行管理
  if (program.server) {
    yield require('./server.js')(program, kylinApp);
  } else {
    try {
      yield require('./build.js')(program, kylinApp);
    } catch (ex) {
      yield require('../log/index.js')(program, false, {
        type: 'project'
      });
      console.error(ex);
      process.exit(1);
    }

    yield require('../log/index.js')(program, true, {
      type: 'project'
    });
  }

  return;
}

// 原地修改
function preprocessKylinAppConfig(program) {
  let kylinApp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (!kylinApp.output) {
    kylinApp.output = 'dist';
  }

  kylinApp.pages = kylinApp.pages || {};

  kylinApp.devPort = process.env.PORT || kylinApp.devPort || 8090;

  kylinApp.options = (0, _kylinOptions2.default)(kylinApp.options);

  kylinApp.dirAlias = kylinApp.dirAlias || {};

  Object.keys(kylinApp.dirAlias).forEach(k => {
    kylinApp.dirAlias[k] = _path2.default.join(program.cwd, kylinApp.dirAlias[k]);
  });

  // nebulaTargetArr 是数组了，至少有1个
  // originalNebulaTarget 如果是空，那就正常生成不考虑，如果不为空，按照nebulaTargetArr生成

  return kylinApp;
}
module.exports = exports['default'];