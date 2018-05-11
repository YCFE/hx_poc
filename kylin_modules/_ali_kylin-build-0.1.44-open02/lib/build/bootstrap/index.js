'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProgramFromProcess = getProgramFromProcess;
exports.getBuildTypeFunc = getBuildTypeFunc;
exports.default = run;

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _commander = require('commander');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProgramFromProcess(argv, cwd) {
  const program = new _commander.Command();

  program.allowUnknownOption() // 允许其他参数列表
  .option('-t, --type <type>', 'build type ["project", "component", "component-old"]') // 确定是 component构建 还是 project构建，默认project构建
  .option('--dev', 'dev') // 一个语法糖，兼容老buildtool ，开启后，会开启server=true,prod=false
  .option('--server', 'start server') // 开启静态服务器，默认不开启服务器
  .option('--https', 'start server with https') // 只有当开启server时才会开启
  .option('--no-prod', '不使用prod配置构建') // 构建配置，默认使用prod构建，默认prod
  .option('--verbose', 'run with more logging messages.') // 针对webpack的输出结果verbose，默认不显示
  .option('--watch', 'start watch') // 使用--dev开启服务器后默认是watch的，其他环境下需要手动开启watch，默认不watch
  .option('--no-compress', 'build without compress') // 是否开启压缩选项，默认压缩
  .option('--hot', 'enable hot-module-replace') // 是否开启热更新，默认关闭
  .option('--open [entry]', 'open entry url in browser') // 指定则打开entry url，只能在server模式启用
  .option('--no-common', 'disable common chunk') // 关闭common构建，默认打开common
  .option('--qrcode [entry]', 'open entry with qrcode') // 指定则显示entry地址的二维码，只能在server模式启用
  .option('--hpm-domain', 'apply hpm domain') // 申请hpm域名，只能在server模式启用
  .option('--sim [entry]', 'hpm sim start [entryUrl]') // 使用hpm sim模拟器启动页面
  .option('--mock [mockConfigFile]', 'using luna-mock') // 使用luna-mock
  .option('--no-order') // 关闭 webpack.optimize.OccurenceOrderPlugin(),
  .option('--sourcemap [sourcemapType]', 'sourcemap type [eval, cheap, module]-source-map') // 指定devtool的sourcemap，默认为 undefined
  // 默认优先读取cwd下面的 kylin.config.js, 如果不存在，降级到 package.json 中的kylinApp或者kylinComponent
  // 当指定--config-path 必须使用指定config，不处理降级
  .option('--config-path <kylinConfig>', 'using specific kylin config path not in package.json').parse(typeof argv === 'string' ? argv.split(' ') : argv);

  program.type = program.type || 'project';
  program.cwd = cwd || process.cwd();

  return program;
}

function getBuildTypeFunc() {
  let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'project';

  let func;

  switch (type) {
    case 'project':
      func = require('../project/index.js');
      break;
    case 'component-old':
      func = require('../component/index.js');
      break;
    case 'component':
      func = require('../_component/index.js');
      break;
    default:
      console.error("Unknown Build Type, only ['project', 'component', 'component-old'] avaliable and 'project' is default ");
  }

  return func;
}

function run() {

  const program = getProgramFromProcess(process.argv, process.cwd());

  const buildFunc = getBuildTypeFunc(program.type);

  return function () {
    return (0, _co2.default)(function* () {
      yield buildFunc(program);
    });
  };
}