import generateResourceImpl from './runtime/resource.js';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import assert from 'assert';

const cwd = process.cwd();

export const pluginName = '@ali/kylin-plugin-resource';

export default function({ program, kylinApp, hint }, option = {}) {
  
  const resourceMap = option.map;
  const shouldClearOther = !!option.onlyMap;

  // 处理下 resourceMap
  // 看看是否符合规定

  if ( resourceMap ) {
    Object.keys(resourceMap).forEach((k) => {
      const npmName = k;
      const configObj = resourceMap[k];
      if ( !configObj ) return;

      const external = configObj.external;
      const js = configObj.js;
      const css = configObj.css;

      if (!external) return;
      if (!js && !css) return;

      const msg = [
        js ? `js: '${js}'` : null,
        css ? `css: '${css}'` : null,
      ].filter(Boolean).join(',');
      hint.success(`[Resource]`, `"${npmName}"=>"global['${external}']": (${msg})`);
    }); 
  }

  return !! resourceMap ? {
    // 在build时修改全局注入资源的能力
    resource: generateResourceImpl({
      resourceMap,
      shouldClearOther
    }),
    // 在build时提供修改babelConfig的能力
    babel: null,
    // 在build时提供修改webpackConfig的能力
    webpack: null,
    // 在浏览器中会执行的代码，不能直接返回函数，必须返回resolve后的路径 
    // 提供一个从node获取数据注入到broswer的简易流程
    browser: null
  } : null

}