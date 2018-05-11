import generateBuildImpl from './runtime/build.js';
import generateBabelImpl from './runtime/babel.js';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const cwd = process.cwd();

export const pluginName = '@ali/kylin-plugin-perflog';

export default function({ program, kylinApp, hint }, option = {}) {
  return {
    // 在build时提供修改babelConfig的能力
    // babel: generateBabelImpl(),
    // 在build时提供修改webpackConfig的能力
    // webpack: generateBuildImpl(),
    // 在浏览器中会执行的代码，不能直接返回函数，必须返回resolve后的路径
    // 提供一个从node获取数据注入到broswer的简易流程
    browser: require.resolve('./runtime/browser.js')
  };
}
