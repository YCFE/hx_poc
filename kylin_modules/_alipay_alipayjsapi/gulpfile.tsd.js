var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var sort = require('gulp-sort');
var mdToJson = require('gulp-markdown-to-json');
var marked = require('marked');
var fs = require('fs-extra');
var argv = require('yargs').array('input').argv;
var path = require('path');
var tmpdir = require('os').tmpdir;
var rootPath = process.cwd();
var defaultInputFiles = [
  './_docs/**/*.md',
  '!./_docs/**/meta.md',
  '!./_docs/index.md',
  '!./_docs/changelog.md',
  '!./_docs/develop.md',
  '!./_docs/data/querystring/*.md',
  '!./_docs/util/extend/*.md',
  '!./_docs/util/log/localLog.md'
];

var defaultOutputPath = './types';
var defaultOutputFileInc = './types/jsapi.inc.d.ts';
var defaultOutputFileNoInc = './types/jsapi.d.ts';
var defaultOutputTestPath = './types/test/';

var libFileMap = {
  './lib/alipayjsapi.inc.d.ts': (
`
import * as ap from '../types/entry.inc';
export default ap;
`  
  ),
  './lib/alipayjsapi.d.ts': (
`
import * as ap from '../types/entry';
export default ap;
`  
      )
}

var inputFiles = argv.input && argv.input.length > 0 ? argv.input : defaultInputFiles;
// var outputFile = argv.output || defaultOutputFile;
var tempFile = '__alipayjsapi_mdtemp.json';
var _SNIPPETS = {};
var _TYPES = {};
var _TYPES_ApiName = {};
let latestApi;
var renderer = new marked.Renderer();
var isCallbackTable = false;
//接口名获取
renderer.heading = (text, level) => {
  if (level === 1) { //接口名
    isCallbackTable = false;
    // genSnippetBodys();
    latestApi = getApiInfo(text);
    latestApi.argsIndex = 0;
    latestApi.suggestion = `${latestApi.name}(${latestApi.option || ''})`;
    latestApi.optionCounter = 1;
    latestApi.body = []; //存放其他 snippets 行
    latestApi.snippet = _SNIPPETS[latestApi.suggestion] = {
      docs: ''
    };
    latestApi.types = _TYPES[latestApi.suggestion] = _TYPES_ApiName[latestApi.name] = {
      apiName: latestApi.name,
      desc: '',
      args: [],
      argsExtra: [],
      returnArg: [],
      returnArgExtra: [],
      shortArgKeys: latestApi.shortcut,
      callback: !!latestApi.callback,
      return: 'Promise<Object>'
    };
  } else if (level === 2) {

    if (/CALLBACK/.test(text)) {
      isCallbackTable = true;
      latestApi.argsIndex = 0;
    }
  }
};
renderer.paragraph = function (text) {
  if (!latestApi.snippet.docs) {
    latestApi.types.desc = latestApi.snippet.docs = text.replace('<br>', '\n');

    if (latestApi.shortcutSnippet) {
      latestApi.shortcutSnippet.docs = text.replace('<br>', '\n');
    }
  }

};
renderer.table = (content) => {


  // 用来做单页面table计数 
  latestApi.argsIndex++;
}
renderer.tablerow = (content) => {
  parseOptionTableRowToSnippet(content);
}
renderer.html = function (html) {
  debugger
  console.log('html')
}
renderer.code = function (code, language) {
  if (/^demo/.test(language) && !/Sync$/.test(latestApi.name)) {
    // 把这个test记录下来
    const apiName = latestApi.name;
    const testPath = path.resolve(defaultOutputTestPath, `./${apiName}.js`);
    code = code.replace(/<(?!script)[^>]+>(.|[\n\r])*?<\/(?!script)[^>]+>/g, '');
    code = code.replace(/<[^>]+>/g, '');
    code = code.replace(/ap\.enableDebug.*;/g, '');
    code = `import ap from '../../lib/alipayjsapi.inc';` + code;
    fs.outputFileSync(testPath, code, 'utf8');
  }
}

marked.setOptions({
  renderer: renderer,
  pedantic: true
});

function parseOptionTableRowToSnippet(content) {
  let tds = content.split('</td>\n<td>');
  let snippet = '';
  if (tds.length === 4) {
    tds = tds.map((el) => {

      return el.replace(/(<\/td>|\n|<td>)/g, '');
    });
    // let val = getInitValueByType(tds[1]);
    // if (tds[0] === latestApi.shortcut) {
    //   latestApi.shortcutTab = val;
    // }
    // snippet = `${tds[0]}: ${val}, //${tds[3]}`;
    // snippet = '\t' + snippet.replace('@',latestApi.optionCounter ++)
    var arg = {
      extra: '',
      name: (tds[0] || '').replace(/(^{{{)|(}}}\s*$)/g, '').trim(),
      originalType: tds[1],
      type: getTsType(tds[1]),
      multiple: /^\d选1$/.test(tds[2]),
      required: /^是|Y$/.test(tds[2]) ? '' : /^否|N$/.test(tds[2]) ? '?' : `[[[未知${tds[2]}]]]`,
      comment: tds[3].replace(/(^{{{)|(}}}\s*$)/g, '')
    };

    if (latestApi.argsIndex === 0) {
      latestApi.types.args.push(arg);
    } else {

      const index = latestApi.argsIndex - 1;
      latestApi.types.argsExtra[index] = latestApi.types.argsExtra[index] || [];
      latestApi.types.argsExtra[index].push(arg);
    }

  } else if (isCallbackTable && tds.length === 3) {
    tds = tds.map((el) => {

      return el.replace(/(<\/td>|\n|<td>)/g, '');
    });
    var arg = {
      extra: '',
      name: (tds[0] || '').replace(/(^{{{)|(}}}\s*$)/g, '').trim(),
      originalType: tds[1],
      type: getTsType(tds[1]),
      required: '',
      comment: tds[2].replace(/(^{{{)|(}}}\s*$)/g, '')
    };


    if (latestApi.argsIndex === 0) {
      latestApi.types.returnArg.push(
        arg
      );
    } else {
      const index = latestApi.argsIndex - 1;
      latestApi.types.returnArgExtra[index] = latestApi.types.returnArgExtra[index] || [];
      latestApi.types.returnArgExtra[index].push(arg);
    }
  }
  return snippet;
}

function getTsType(type) {
  let val;
  type = type.toLowerCase();
  switch (type) {
    case 'string number boolean':
      val = 'string|number|boolean';
      break;
    case 'string number':
      val = 'string|number';
      break;
    case 'string/arraybuffer':
      val = 'string|ArrayBuffer';
      break;
    case 'hex string':
    case 'string':
      val = "string";
      break;
    case 'object':
      val = 'Object';
      break;
    case 'number':
      val = 'number';
      break;
    case 'array':
      val = 'string[]';
      break;
    case 'boolean':
      val = 'boolean';
      break;
    case 'object/string':
      val = 'Object|string'
      break;
    case 'string array':
      val = 'string[]';
      break;
    default:
      console.log('type', type);
      val = "any";
  }
  return val;
}

function getApiInfo(text) {
  var api = {};
  var match = text.match(/^ap\.(\w+)\((\w+)??((?: \| (\w+))*)(?:(?:, )?(CALLBACK))?\)$/i);
  if (match) {
    api = {
      name: match[1],
      option: match[2],
      shortcut: (match[3] || '').split('|').slice(1).map(d => d.trim()),
      callback: match[5]
    };
  }
  if (api.name === undefined) {
    console.log('未识别接口，请手动处理>>>> ', api, text);
  }
  return api;
}



gulp.task('default', function () {
  debugger
  gulp.src(inputFiles)
    .pipe(sort())
    .pipe(gutil.buffer())
    .pipe(mdToJson(marked, tempFile, function (data, file) {
      // console.log('file',file.relative);
      if (!data) {
        throw new TypeError(`data not found`);
      } else {
        const apiName = data.title.replace(/^ap\./, '').replace(/<[^>]+>inc<\/[^>]+>/, '');
        const foudnApiType = _TYPES_ApiName[apiName];
        if (foudnApiType) {
          foudnApiType.isInc = !data.public;
        } else if (/Deprecated/.test(data.title)) {
          // ignore
        } else {
          throw new TypeError(`inc not found`);
        }

      }
      return data;
    }))
    .pipe(gulp.dest(tmpdir()))
    .on('end', () => {
      console.log('end');
      fs.outputFileSync(defaultOutputFileInc, formatTypeDefinition(_TYPES, true));
      fs.outputFileSync(defaultOutputFileNoInc, formatTypeDefinition(_TYPES, false));

      // libFileMap
      Object.keys(libFileMap).forEach(toPath => {
        const content = libFileMap[toPath];
        fs.outputFileSync(toPath, content);
      });
      

      // fs.outputFileSync('./_snippets/snippets.json', JSON.stringify(_SNIPPETS, undefined, '  '));
    })
});

function getCustomType(arg, apiName) {
  if (apiName === 'getAuthCode' && arg.name === 'scopes') {
    return `'auth_base'|'auth_user'|Array<'auth_base'|'auth_user'>`;
  } else if (apiName === 'setOptionButton' && arg.name === 'onClick') {
    return `(data: {index: number}) => void`
  } else if (apiName === 'rpc' && arg.name === 'requestData') {
    return `Object`;
  } else if (apiName === 'getConfig' && arg.name === 'keys') {
    return `Array<'mgw'|'did'|'uuid'|string>`;
  } else if (apiName === 'showToast' && arg.name === 'type') {
    return `'none'|'success'|'fail'|'exception'`;
  } else if (/getStorage|removeStorage|setStorage|clearStorage/.test(apiName) && arg.name === 'type') {
    return `'user'|'common'`;
  } else if (apiName === 'chooseImage' && arg.name === 'sourceType') {
    return `Array<'camera'|'album'|string>`;
  } else if (/^(onPageResume|getSessionData|getStorage|onResume)$/.test(apiName) && arg.name === 'data') {
    return `any`;
  } else if (/^(alert|confirm|showLoading|showToast)$/.test(apiName) && arg.name === 'content') {
    return 'any';
  }

  return arg.type;
}

function getExtraArgAtIndex(arg, argsExtra, extraIndex, forceOptinal, forceNotArray) {
  var ret = '';
  var reusedExtraIndex = 0;

  const name = arg.name.replace(/<[^>]+>/g, '').trim();
  var isNotArray = forceNotArray || !/array/i.test(arg.originalType);
  if (arg.comment) {
    ret += `${isNotArray ? '' : 'Array<'}{\n`;
  } else {
    ret += `${isNotArray ? '' : 'Array<'}{\n`;
  }
  argsExtra[extraIndex].forEach((arg, index) => {
    if (arg.ignore) return;
    if (/<[^>]+>/.test(arg.name)) {
      reusedExtraIndex++;
      const name = arg.name.replace(/<[^>]+>/g, '').trim();
      var isNotArray = !/array/i.test(arg.originalType);

      if (arg.comment) {
        ret += `        /** ${arg.comment.replace(/<[^>]+>/g, '')} */
        ${name}${forceOptinal ? '?' : arg.required}: ${isNotArray ? '' : 'Array<'}{\n`;
      } else {
        ret += `        ${name}${forceOptinal ? '?' : arg.required}: ${isNotArray ? '' : 'Array<'}{\n`;
      }
      argsExtra[extraIndex + reusedExtraIndex].forEach((arg, index) => {
        ret += arg.comment ? `          /** ${arg.comment.replace(/<[^>]+>/g, '')} */
          ${arg.name}${forceOptinal ? '?' : arg.required}: ${arg.type},` :
          `        ${arg.name}${forceOptinal ? '?' : arg.required}: ${arg.type},`;
        ret += '\n';
      });
      ret += `        }${isNotArray ? '' : '>'},\n`
    } else {
      ret += arg.comment ? `        /** ${arg.comment.replace(/<[^>]+>/g, '')} */
        ${arg.name}${forceOptinal ? '?' : arg.required}: ${arg.type},` :
        `        ${arg.name}${forceOptinal ? '?' : arg.required}: ${arg.type},`;
      ret += '\n';
    }
  });
  ret += `      }${isNotArray ? '' : '>'}`

  extraIndex += reusedExtraIndex + 1;

  return {
    text: ret,
    newIndex: extraIndex,
  }
}

function formatArgsAll(args, argsExtra, apiName, isReturn, forceOptinal) {
  let ret = '';
  let items = [];
  let set = {};
  let extraIndex = 0;
  for (let i = 0; i < args.length; i++) {
    if (/<[^>]+>/.test(args[i].name)) {
      let result;
      if (argsExtra[extraIndex].filter(x => x.multiple).length) {
        // 需要处理成多个或
        let options = [];
        const allOptions = argsExtra[extraIndex].filter(x => x.multiple);
        allOptions.forEach((arg, index) => {
          allOptions.forEach(arg => {
            arg.ignore = true;
          });
          allOptions[index].ignore = false;
          allOptions[index].required = '';

          // 自己设置为 required: '';
          // 其他都ignore: true
          // 生成一次，用 | 拼起来
          result = getExtraArgAtIndex(args[i], argsExtra, extraIndex, forceOptinal, true);
          options.push(result.text);
        });
        var isNotArray = !/array/i.test(args[i].originalType);
        result = {
          newIndex: result.newIndex,
          text: (isNotArray ? '' : `Array<`) + options.join(' | ') + (isNotArray ? '' : `>`)
        }
      } else {
        result = getExtraArgAtIndex(args[i], argsExtra, extraIndex, forceOptinal);
      }
      const {
        newIndex,
        text
      } = result;


      // 那这个参数对应数据由以下extra来提供，不能提供抛错
      const name = args[i].name.replace(/<[^>]+>/g, '').trim();
      var isNotArray = !/array/i.test(args[i].type);
      if (args[i].comment) {
        ret += `      /** ${args[i].comment.replace(/<[^>]+>/g, '')} */
      ${name}${forceOptinal ? '?' : args[i].required}: `;
      } else {
        ret += `    ${name}${forceOptinal ? '?' : args[i].required}: `;
      }

      ret += text;
      extraIndex = newIndex;
      args[i].extra = text;
      ret += ',\n';
    } else {

      const arg = args[i];
      const type = getCustomType(arg, apiName)
      // 正常输出
      if (!set[arg.name]) {
        set[arg.name] = true;
        ret += arg.comment ? `      /** ${arg.comment.replace(/<[^>]+>/g, '')} */
      ${arg.name}${forceOptinal ? '?' : arg.required}: ${type},` :
          `      ${arg.name}${forceOptinal ? '?' : arg.required}: ${type},`;
        if (i !== args.length - 1) ret += '\n';
      }
    }
  }

  if (extraIndex !== argsExtra.length) {
    throw new TypeError('extra table not balance');
  }
  return ret;
}

function removeArrayType(type) {
  if (/\[\]$/.test(type)) {
    return type.replace(/\[\]$/, '');
  } else if (/^Array<.*?>$/.test(type)) {
    return type.replace(/^Array</, '').replace(/>$/, '');
  } else {
    debugger
    return type;
  }
}

function formatTypeDefinition(_TYPES, needInc) {

  var infos = Object.keys(_TYPES).map(k => _TYPES[k]).filter(d => !/Sync$/.test(d.apiName));

  var ret = (
    `
// declare namespace ap {

${infos.map((d) => {

      var apiName = d.apiName;
      var returnArg = d.returnArg;
      var isInc = d.isInc;
      if (typeof isInc !== 'boolean') {
        throw new TypeError(`inc not found in types`);
      }
      if (isInc && !needInc) return '';
      if ( /^(rpc|httpRequest)$/.test(apiName) ) {
        returnArg.push({
          name: '[field: string]',
          type: 'any',
          required: '',
          comment: '返回任意业务字段'
        })
      };
      if (returnArg.length) {
        returnArg = returnArg.concat([
          {
            name: 'error',
            type: 'number',
            required: '?',
            comment: '错误码'
          },
          {
            name: 'errorMessage',
            type: 'string',
            required: '?',
            comment: '错误信息'
          }
        ]);
      } else {
        returnArg = returnArg.concat([
          {
            name: 'error',
            type: 'number',
            required: '?',
            comment: '错误码'
          },
          {
            name: 'errorMessage',
            type: 'string',
            required: '?',
            comment: '错误信息'
          }
        ]);
      }
      var returnArgExtra = d.returnArgExtra;
      var returnArgText = returnArg && returnArg.length ? `{ 
${formatArgsAll(returnArg, returnArgExtra, apiName, true)}
    }` : 'Object';
      var returnArgTextWihtOptional = returnArg && returnArg.length ? `{ 
${formatArgsAll(returnArg, returnArgExtra, apiName, true, true)}
    }` : 'Object';
      returnArgTextWihtOptional = returnArgTextWihtOptional.replace('[field: string]?', '[field: string]');
      var args = d.args.concat([
        {
          name: 'success',
          type: `(result?: ${returnArgText.replace(/^/mg, '  ')}) => void`,
          comment: '接口调用成功的回调函数',
          extra: '',
          required: '?'
        },
        {
          name: 'fail',
          type: `(result?: ${returnArgTextWihtOptional.replace(/^/mg, '  ')}) => void`,
          comment: '接口调用失败的回调函数',
          extra: '',
          required: '?'
        },
        {
          name: 'complete',
          type: `(result?: ${returnArgTextWihtOptional.replace(/^/mg, '  ')}) => void`,
          comment: '接口调用结束的回调函数（调用成功、失败都会执行）',
          extra: '',
          required: '?'
        }
      ]);
      var argsExtra = d.argsExtra;
      var descs = d.desc.split('\n');
      var hasCallback = d.callback;

      var optionArg = formatArgsAll(args, argsExtra, apiName);
      var optionOptional = args.reduce((ret, arg) => ret && arg.required, true);


      var normalCall = (
        `    /**
${descs.map(d => (
          `     * ${d}`
        )).join('\n')}
${args.length ? '     * @param option\n' : ''}     */ 
    export function ${apiName}(${args.length ? `option: {
${optionArg}      
    }`: ''}${hasCallback ? `${optionArg ? ', ' : ''}callback?: (result: ${returnArgText}) => void` : ''}): Promise<${hasCallback ? returnArgText : 'any'}>;
`
      );

      var normalCallWithoutOption = ''

      if (args.length && optionOptional) {
        normalCallWithoutOption += '\n';
        normalCallWithoutOption += (
          `    /**
${descs.map(d => (
            `     * ${d}`
          )).join('\n')}
${args.length ? '     * @param option\n' : ''}     */ 
    export function ${apiName}(${hasCallback ? `callback?: (result: ${returnArgText}) => void` : ''}): Promise<${hasCallback ? returnArgText : 'any'}>;
`
        );
      }

      var shortCalls = [];
      if (d.shortArgKeys.length) {
        d.shortArgKeys.forEach(shortArgKey => {
          var shortArg = args.find(d => d.name.replace(/<[^>]+>/g, '').trim() === shortArgKey);
          if (!shortArg) {
            // 猜测为加一个s
            shortArg = args.find(d => d.name.replace(/<[^>]+>/g, '').trim() === `${shortArgKey}s`);
            if (!shortArg) {
              debugger
              // throw new TypeError('shortcut not found');
              return;
            }

            shortArg = JSON.parse(JSON.stringify(shortArg));
            shortArg.type = removeArrayType(shortArg.type);
            if (shortArg.extra) {
              shortArg.extra = removeArrayType(shortArg.extra);
            }
            shortArg.name = shortArgKey;
            shortArg.required = '';

          }
          var shortCall = (
            `    /**
${descs.map(d => (
              `     * ${d}`
            )).join('\n')}
     */ 
    export function ${apiName}(${shortArgKey}: ${shortArg.extra.replace(/^\s{2}/mg, '') || getCustomType(shortArg, apiName)}${hasCallback ? `${optionArg ? ', ' : ''}callback?: (result: ${returnArgText}) => void` : ''}): Promise<${hasCallback ? returnArgText : 'any'}>;
`
          );
          shortCalls.push(shortCall);

        })
      }
      return (
        normalCall + (shortCalls.length ? '\n' : '') + shortCalls.join('\n') + normalCallWithoutOption
      )
    }).join('\n')}
`
  )

  ret += (
    `
    /**
     * 显示导航栏右上角弹出的下拉菜单。可直接传入一个数组作为 OPTION.items 参数。
     * @param {string[]} 菜单title数组
     */ 
    export function showPopMenu(items: Array<string>, callback?: (result: { 
      /** 被点击的菜单项的索引，从0开始 */
      index: number,
      /** 错误码 */
      error?: number,
      /** 错误信息 */
      errorMessage?: string,
    }) => void): Promise<{ 
      /** 被点击的菜单项的索引，从0开始 */
      index: number,
      /** 错误码 */
      error?: number,
      /** 错误信息 */
      errorMessage?: string,
    }>;
`
  )

  // ret += '}';
  return ret;
}