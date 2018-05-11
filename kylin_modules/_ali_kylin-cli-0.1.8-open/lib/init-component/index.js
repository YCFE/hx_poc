'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = initComponent;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _userHome = require('user-home');

var _userHome2 = _interopRequireDefault(_userHome);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* getOutputDir(program, _ref) {
  let componentName = _ref.componentName,
      componentNameDash = _ref.componentNameDash,
      componentNameCamel = _ref.componentNameCamel;

  // 先检测一下当前是否存在package.json
  // 是否存在 对应pageNameDash，存在则报错
  // 如果不存在，询问是否在 [TODO] 目录下生成page模板
  // 如果连package.json都不存在，询问是否直接在当前目录下生成page模板

  const packageJsonPath = `${program.cwd}/package.json`;
  const packageJsonExisted = _fs2.default.existsSync(packageJsonPath);
  if (packageJsonExisted) {
    // 尝试读取
    const packageJsonFile = require(packageJsonPath);

    if (packageJsonFile && packageJsonFile.kylinApp) {
      const pages = JSON.parse(JSON.stringify(packageJsonFile.kylinApp.pages || {}));

      const pageEntrys = Object.keys(pages).map(pName => {
        const ret = pages[pName];
        ret.pageName = pName;
        return ret;
      }).filter(d => !!d);

      const pageComponentDirs = pageEntrys.map(d => {
        const dir = _path2.default.dirname(d.entry);
        const componentDir = _path2.default.join(dir, `./components/${componentNameDash}.vue`);
        return {
          name: `${d.pageName} -- (${componentDir})`,
          short: componentDir,
          value: componentDir
        };
      });

      // 如果检测有效的page entry，开启选择
      if (pageComponentDirs.length > 0) {

        const choices = pageComponentDirs;

        const ans = yield (0, _utils.question)([{
          name: 'outputPath',
          type: 'list',
          message: `将在以下路径生成'${componentNameDash}'组件模板\n`,
          choices: choices
        }]);

        return {
          outputPath: (0, _utils.getOutputAbsDir)(program, ans.outputPath),
          hasPackageJson: true
        };
      }
    } else {
      // 当做没有package.json来处理
    }
  }

  // 没有有效entry或者没有package.json
  const ans = yield (0, _utils.question)([{
    name: 'outputPath',
    type: 'input',
    message: `无package.json或无有效page entry,\n将在以下路径生成'${componentNameDash}'组件模板\n`,
    default: `${program.cwd}/${componentNameDash}.vue`
  }]);

  return {
    outputPath: (0, _utils.getOutputAbsDir)(program, ans.outputPath),
    hasPackageJson: false
  };
}

function* initComponent(program) {

  program.templatePath = program.t = program.t || 'kylin_templates';

  const args = program.args,
        cwd = program.cwd;

  let template, componentName;
  if (args.length === 0) {
    throw new Error(`no args`);
  } else if (args.length === 1) {
    componentName = args[0];
    template = 'component-template';
  } else {
    componentName = args[1];
    template = args[0];
  }

  const componentNameDash = (0, _utils.parseNameDash)(componentName);
  const componentNameCamel = (0, _utils.parseNameCamel)(componentName, true);

  var _ref2 = yield getOutputDir(program, {
    componentName: componentName,
    componentNameDash: componentNameDash,
    componentNameCamel: componentNameCamel
  });

  const outputPath = _ref2.outputPath,
        hasPackageJson = _ref2.hasPackageJson;


  const gitRepo = getFullGitReps({
    template: template,
    program: program
  });

  const tmp = getTempPath(_extends({}, gitRepo, {
    program: program
  }));

  const repo = getRepo(_extends({}, gitRepo, {
    tmp: tmp,
    program: program
  }));
  // 开始下载


  _utils.hint.warn('[Info] Mode:', 'init-component');
  (0, _utils.hint)('[Info] Template:', template);
  (0, _utils.hint)('[Info] Repo:', repo);
  (0, _utils.hint)('[Info] Tmp:', tmp);
  (0, _utils.hint)('[Info] OutputPath:', outputPath);

  try {
    if (program.t) {
      yield (0, _utils.gitlabCloneForLocal)({
        repo: repo,
        tmp: tmp,
        program: program,
        template: template
      });

      _utils.hint.success('[Copy]');
    } else {
      const cloneResult = yield gitlabClone({
        repo: repo,
        tmp: tmp,
        program: program,
        template: template
      });

      _utils.hint.success('[Clone]');
      console.log(cloneResult);
    }
  } catch (ex) {
    _utils.hint.error('[Fail] git clone to tmp directory');
    console.error(ex);
    return;
  }

  try {
    // 拷贝文件到当前目录
    // 数据替换,
    (0, _utils.copyAndReplaceForFile)(`${tmp}/index.vue`, outputPath, {
      componentName: componentNameCamel
    });

    _utils.hint.success('[Done]');
  } catch (ex) {
    _utils.hint.error('[Fail] copy template files to dest');
    console.error(ex);
  }
}

// 确定最终的仓库完整地址
// 更多 template 补全预测逻辑在这里
function getFullGitReps(_ref3) {
  let template = _ref3.template;


  const hasSlash = template.indexOf('/') > -1;
  const defaultRepoHost = 'gitlab.alipay-inc.com';
  if (!hasSlash) {
    return {
      host: defaultRepoHost,
      template: `kylin-templates/${template}`
    };
  } else {
    return {
      host: defaultRepoHost,
      template: template
    };
  }
}

function getTempPath(_ref4) {
  let program = _ref4.program,
      template = _ref4.template;

  const tmp = _path2.default.join(_userHome2.default, '.kylin-templates', template.replace(/\//g, '-'));
  // 清理一下tmp目录
  _rimraf2.default.sync(tmp);
  return tmp;
}

function getRepo(_ref5) {
  let program = _ref5.program,
      host = _ref5.host,
      template = _ref5.template;

  const url = `git@${host}:${template}.git`;
  return url;
}

function* gitlabClone(_ref6) {
  let repo = _ref6.repo,
      tmp = _ref6.tmp,
      program = _ref6.program;


  const result = yield (0, _utils.exec)(`git clone --progress ${repo} ${tmp}`, { slient: true });

  // 看下目录是否存在，如果目录存在，认为clone成功
  const exists = _fs2.default.existsSync(tmp);

  if (!exists) {
    throw new Error(`destination "${tmp}" not found`);
  }

  // git打出来的都在 stderr上
  return result.stderr;
}
module.exports = exports['default'];