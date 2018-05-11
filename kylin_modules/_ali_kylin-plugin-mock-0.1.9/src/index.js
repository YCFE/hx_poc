import generateBuildImpl from './runtime/build.js';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const cwd = process.cwd();

export const pluginName = '@ali/kylin-plugin-mock';

export default function({ program, kylinApp, hint }, option = {}) {

  const allowMockProd = program.rawArgs.indexOf('--allow-mock-prod') >= 0;
  // 先看option, 然后再看 arg
  let enable = [
    typeof program.mock === 'boolean' ? program.mock : undefined,
    typeof program.mock === 'undefined' ? undefined: !!program.mock,
    typeof option.enable === 'boolean' ? option.enable : undefined,
    false
  ].filter(d => typeof(d) === 'boolean')[0];

  if ( program.prod && !allowMockProd && enable ) {
    hint.warn("[Mock]", `prod构建关闭mock功能`);
    enable = false;
  }

  // 先看option, 然后再看 arg
  let config = [  
    typeof program.mock === 'string' ? program.mock : '',
    typeof option.config === 'string' ? option.config : '',
    './mock/mock.config.js'
  ].filter(Boolean)[0];

  const absoluteConfig = path.resolve( cwd, config );

  // 开启mock
  // 开启失败

  if ( enable ) {
    if ( fs.existsSync( absoluteConfig ) ) {
      hint.success("[Mock]", `加载 LunaMock 配置 ${ config }`);
    } else {
      enable = false;
      hint.error("[Mock]", `${ chalk.red(`没有找到`) } [${chalk.red(config)}] ${ chalk.red(`，将使用默认配置，无法使用自定义mock功能，`) }\n请参考${ chalk.yellow(`http://gitlab.alipay-inc.com/luna/luna-mock/blob/master/demo/mock.config.js`) }`);
    }
  }

  return enable ? {
    // 在build时提供修改babelConfig的能力
    babel: null,
    // 在build时提供修改webpackConfig的能力
    webpack: generateBuildImpl(absoluteConfig),
    // 在浏览器中会执行的代码，不能直接返回函数，必须返回resolve后的路径 
    // 提供一个从node获取数据注入到broswer的简易流程
    // 注入代码片段！不止数据
    // 用户希望
    // 运行该函数，输出code字符串
    // 剩下的事，由build完成注入
    // 片段拼接自行完成
    browser: require.resolve('./runtime/browser.js')
  } : {}

}