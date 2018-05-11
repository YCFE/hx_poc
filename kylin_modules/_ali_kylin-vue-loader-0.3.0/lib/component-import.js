var babelPluginImport = require('./babel-plugin-import');
var chalk = require('chalk');
var path = require('path');

/**
 * 从 <component src="" default="" name="" />解析到
 * { requireString: '', identifier: '', importName: '', attrs: { lazy, split } }
 * @param block
 */
// 目前只支持以下格式
// 1. import defaultName from  ==>  <component default="a">
// 2. import { member } from  ==>  <component member="a, b, c, d">
// 3. import { member as alias } from  ==>  <component member="a, b as c, d">
exports.componentParser = function componentParser(block) {

  var ret = [];

  // 加一层对 block.attrs.component 的预处理
  var attrDefault = null, attrMember= null;

  if ( block.attrs.component ) {
    // 新的格式提取
    // 命中member语法
    if ( /^\s*{.*?}\s*$/.test(block.attrs.component) ) {
      // 把 {} 移除掉
      attrMember = block.attrs.component;
      attrMember = attrMember.replace(/^\s*{/,'');
      attrMember = attrMember.replace(/}\s*$/,'');

      block.attrs.member = attrMember;
    } else {
      // 必须要求其中左右trim后不存在 空格和逗号，否则直接报错说请使用{}包括
      attrDefault = block.attrs.component;

      var cleanAttr = attrDefault.replace(/^\s*/,'').replace(/\s*$/,'');
      var err = false;
      if ( /,/.test(cleanAttr) ) {
        console.log(chalk.red(
          `[Error] mistake use <dependency component="${attrDefault}"> for member import\n`+
          `please try <dependency component="{${attrDefault}}">`));
        console.log(chalk.red(
          `[Error] 可能错误使用 <dependency component="${attrDefault}"> 作为ES6成员命名导入\n`+
          `请尝试再左右加入或括号，如 <dependency component="{${attrDefault}}">`));
         
        err = true;
      }

      if ( /\s/.test(cleanAttr) ) {
        console.log(chalk.red(
          `[Error] mistake use <dependency component="${attrDefault}"> for defalut import\n`+
          `component="{${attrDefault}}" within whitespace is not allowed`));
        console.log(chalk.red(
          `[Error] 可能错误使用 <dependency component="${attrDefault}"> 作为ES6 default命名导入\n`+
          `component="{${attrDefault}}" 中不允许包含空格`));
        err = true;
      }

      if ( err ) {
        console.log(chalk.yellow(`[Tips] visit "http://kylin.alipay.net/kylin/framework/component/spec.html#标签属性" for more help`));
         throw new Error('dependency-default-import-checkfail');
      }

      block.attrs.default = attrDefault;
    }


  }

  if ( block.attrs.default ) {
    return [{
      identifier: block.attrs.default,
      importName: 'default',
      attrs: block.attrs,
      src: block.attrs.src
    }]
  }
  else if ( block.attrs.member ) {

    // 对member字符串进行解析
    return parseMemberImport(block.attrs.member, block);
  }

}


function parseMemberImport(memberStr, block) {
  memberStr = memberStr.trim();

  // memberStr:   a,b as c, c
  // m: a    |    b as c
  var memberArr = memberStr.split(',').map(function (m) {
    // ['m']   | ['b','c']
    return m.trim().split('as').map(function (m) {
      return m.trim()
    });
  });

  return memberArr.map(function (ma) {
    return {
      identifier: ma[1] || ma[0],
      importName: ma[0],
      attrs: block.attrs,
      src: block.attrs.src
    }
  })
}

function jsBlockRequire(block) {
  var requireString = '';
  if ( block.importName === 'default' ) {
    requireString = '  var ret = require("' + block.src +'");\n' +
      '  ret = ret.default || ret;\n';
  }
  else {
    requireString = '  var ret = require("' + block.src +'");\n' +
      '  ret = ret["'+ block.importName +'"]'
  }
  return requireString;
}

function processNoSplitStyle(block) {
  var ret = null;
  var styleAttr = block.attrs.style;
  
  styleAttr = styleAttr === 'true' ? true : styleAttr;
  styleAttr = styleAttr === 'false' ? false : styleAttr;

  if ( styleAttr ) {
    // 如果
    var stylePath = '/lib/index.css';
    if ( typeof styleAttr == 'string' ) {
      stylePath = path.join(block.attrs.src, styleAttr);
      ret = {
        src: stylePath
      }
    }
  }

  return ret;
}

/**
 * 输入上述block，输出可供webpack解析的结构，同时处理完 babel-plugin-import, lazy的事情
 * @param block
 */
exports.generateComponentDep = function generateComponentDep(parsedBlock) {

  var requireString = '';
  var output = '';

  // 如果启用split，但不是member导出，需要关闭split
  if ( parsedBlock.attrs.split !== undefined && !parsedBlock.attrs.member ) {
    console.log(chalk.yellow(
      `[WARN] attribute 'split' without member exports will do nothing`
      ));
  }

  // 如果是member导出，并且启用split功能
  if ( parsedBlock.attrs.member && parsedBlock.attrs.split !== undefined ) {
    var blockWithStyle = babelPluginImport(parsedBlock);
    var jsBlock = blockWithStyle.js;
    var styleBlock = blockWithStyle.style;

    requireString = jsBlockRequire(jsBlock) + ( styleBlock ? (
        '  require("'+ styleBlock.src +'");\n'
      ) : '');


  }
  else {
    // 如果没有importName
    // 如果importName === 'default'
    // 如果不是default

    // TODO 在这里看下是否还需要加载style
    var styleBlock = processNoSplitStyle(parsedBlock);
    requireString = jsBlockRequire(parsedBlock) + ( styleBlock ? (
      ' require("'+ styleBlock.src +'") '
    ) : '');
  }

  requireString = '(function () { \n' +
    requireString + '\n' +
    '  return ret; \n})()';

  // 如果开启了 lazy，在外面包一层
  if ( parsedBlock.attrs.lazy !== undefined ) {

    output = 'function (resolve) {\nresolve( \n'+requireString+'\n);\n}';

  }
  else {
    output = requireString;
  }

  return output;
}

/**
 * 判断part是否是合法的 component块
 * @param part
 */
exports.componentBlockFormat = function componentBlockFormat(part) {
  var ret = false;
  var attrs = part.attrs;

  if ( !part || !(part.type === 'component' || part.type === 'dependency') || !part.attrs ) {
    ret = false;
  } else if ( !attrs.src ) {
    ret = false;
  } else if ( attrs.default || attrs.member || attrs.component ) {
    ret = true;
  }

  // 打出warn， 对于不满足的customBlock
  if ( !ret ) {
    var attrsStr = Object.keys(attrs).map(d => {
      if ( attrs[d] === '' ) return d;
      else return d + '="'+ attrs[d] +'"'
    }).join(' ');
    console.log(chalk.yellow('[WARN] <'+part.type+' '+attrsStr+'> may be not available for current version of vue-loader'));
  }

  if ( part.type === 'component' ) {
    console.log(chalk.yellow('[WARN] should use <dependency> insteadof <component>'));
  }
  if ( !attrs.component ) {
    if ( attrs.default ) {
    console.log(chalk.yellow(`[WARN] should use `+ chalk.green(`<dependency component="${attrs.default}" />`) +` instead of `+chalk.green(`<${part.type} default="${attrs.default}" />`)));
    }
    if ( attrs.member ) {
      console.log(chalk.yellow(`[WARN] should use `+ chalk.green(`<dependency component="{${attrs.member}}" />`) +` instead of `+chalk.green(`<${part.type} member="${attrs.member}" />`)));
    }
  }
  

  return ret;
}