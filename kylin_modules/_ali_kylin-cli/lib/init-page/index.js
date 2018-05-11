'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = initPage;

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

var _constant = require('../utils/constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* editPackageJsonPages(program, _ref) {
  let pageNameMap = _ref.pageNameMap,
      outputDir = _ref.outputDir,
      layoutFile = _ref.layoutFile,
      configLayout = _ref.configLayout;


  // 再次检测一下packageJson
  // 如何
  const packageJsonPath = `${program.cwd}${_path2.default.sep}package.json`;
  const packageJsonFile = require(packageJsonPath);

  if (packageJsonFile && packageJsonFile.kylinApp) {
    const pages = packageJsonFile.kylinApp.pages = packageJsonFile.kylinApp.pages || {};

    let relativeDir = _path2.default.relative(program.cwd, `${outputDir}${_path2.default.sep}index.js`);
    let relativeLayout = configLayout ? _path2.default.relative(program.cwd, layoutFile) : undefined;

    if (_utils.isWin) {
      relativeDir = relativeDir.replace(/\\/g, '/');
      relativeLayout = relativeLayout.replace(/\\/g, '/');
    }

    pages[pageNameMap.package_entry] = configLayout ? {
      entry: _path2.default.isAbsolute(relativeDir) ? relativeDir : `./${relativeDir}`,
      template: _path2.default.isAbsolute(relativeLayout) ? relativeLayout : `./${relativeLayout}`
    } : {
      entry: _path2.default.isAbsolute(relativeDir) ? relativeDir : `./${relativeDir}`
    };

    _fs2.default.writeFileSync(packageJsonPath, JSON.stringify(packageJsonFile, undefined, 2), 'utf-8');
  }
}

function* getOutputDir(program, _ref2) {
  let pageNameMap = _ref2.pageNameMap,
      configLayout = _ref2.configLayout;

  // 先检测一下当前是否存在package.json
  // 是否存在 对应pageNameDash，存在则报错
  // 如果不存在，询问是否在 [TODO] 目录下生成page模板
  // 如果连package.json都不存在，询问是否直接在当前目录下生成page模板

  const packageJsonPath = `${program.cwd}${_path2.default.sep}package.json`;
  const packageJsonExisted = _fs2.default.existsSync(packageJsonPath);
  if (packageJsonExisted) {
    // 尝试读取
    const packageJsonFile = require(packageJsonPath);

    if (packageJsonFile && packageJsonFile.kylinApp) {
      const pages = packageJsonFile.kylinApp.pages || {};

      const hasConflictPage = Object.keys(pages).filter(d => d === pageNameMap.dash || d === pageNameMap.camel || d === pageNameMap.origin);

      if (hasConflictPage.length === 0) {

        let questionList = [{
          name: 'outputDir',
          type: 'input',
          message: `将在以下目录生成'${pageNameMap.path}'页面模板\n`,
          default: `${program.cwd}${_path2.default.sep}src${_path2.default.sep}pages${_path2.default.sep}${pageNameMap.path}/`
        }];

        if (configLayout) {
          questionList = questionList.concat([{
            name: 'layoutFile',
            type: 'input',
            message: `将在以下路径生成'${pageNameMap.path}.html'模板文件\n`,
            default: `${program.cwd}${_path2.default.sep}src${_path2.default.sep}layout${_path2.default.sep}${pageNameMap.path}.html`
          }, {
            name: 'layoutTitle',
            type: 'input',
            message: `请输入模板的默认'title'\n`,
            default: `${pageNameMap.title}`
          }]);
        }

        const ans = yield (0, _utils.question)(questionList);

        return {
          outputDir: (0, _utils.getOutputAbsDir)(program, ans.outputDir),
          layoutFile: ans.layoutFile ? (0, _utils.getOutputAbsDir)(program, ans.layoutFile) : undefined,
          layoutTitle: ans.layoutTitle,
          hasPackageJson: true
        };
      } else {
        const errMsg = `'${pageNameMap.origin}'在kylinApp.pages中已存在重名页面配置`;
        _utils.hint.error(`[package.json]`, errMsg);
        throw new Error(errMsg);
      }
    } else {
      // 当做没有package.json来处理
    }
  }

  const ans = yield (0, _utils.question)([{
    name: 'outputDir',
    type: 'input',
    message: `无package.json或无kylinApp字段,\n将在以下目录生成'${pageNameMap.path}'页面模板\n`,
    default: `${program.cwd}${_path2.default.sep}${pageNameMap.path}${_path2.default.sep}`
  }]);

  return {
    outputDir: (0, _utils.getOutputAbsDir)(program, ans.outputDir),
    hasPackageJson: false
  };
}

function getPageNameByType(pageName, type) {
  switch (type) {
    case _constant.PAGE_NAME_TYPE.CAMEL:
      return (0, _utils.parseNameCamel)(pageName, true);
    case _constant.PAGE_NAME_TYPE.DASH:
      return (0, _utils.parseNameDash)(pageName);
    case _constant.PAGE_NAME_TYPE.ORIGIN:
      return pageName;
    default:
      throw new Error('unknown type for pageName');
  }
}

function* initPage(program) {

  program.templatePath = program.t = program.t || 'kylin_templates';

  const args = program.args,
        cwd = program.cwd;

  let template, pageName;
  if (args.length === 0) {
    throw new Error(`no args`);
  } else if (args.length === 1) {
    pageName = args[0];
    template = 'page-template';
  } else {
    pageName = args[1];
    template = args[0];
  }

  // 如果是本地项目才开启该功能
  const configLayout = !!program.t;
  let preferPageNameOrigin = false;

  // 默认配置项
  const pageNameTypeMap = {
    // 常量
    origin: _constant.PAGE_NAME_TYPE.ORIGIN,
    camel: _constant.PAGE_NAME_TYPE.CAMEL,
    dash: _constant.PAGE_NAME_TYPE.DASH,

    // 各场景下的不同显示
    // getOutputDir中使用的路径，输出page路径
    path: _constant.PAGE_NAME_TYPE.DASH,
    // getOutputDir中使用的layoutTitle，layout中的标题
    title: _constant.PAGE_NAME_TYPE.CAMEL,
    // editPackageJsonPages修改package.json entry
    package_entry: _constant.PAGE_NAME_TYPE.DASH,
    // page-template模板的js和vue文件的符号
    template: _constant.PAGE_NAME_TYPE.CAMEL,
    // page-template layout文件html片段
    template_layout: _constant.PAGE_NAME_TYPE.CAMEL
  };

  if (preferPageNameOrigin) {
    pageNameTypeMap.path = _constant.PAGE_NAME_TYPE.ORIGIN;
    pageNameTypeMap.title = _constant.PAGE_NAME_TYPE.ORIGIN;
    pageNameTypeMap.package_entry = _constant.PAGE_NAME_TYPE.ORIGIN;
    pageNameTypeMap.template = _constant.PAGE_NAME_TYPE.CAMEL;
    pageNameTypeMap.template_layout = _constant.PAGE_NAME_TYPE.ORIGIN;
  }

  // 生成 key => type
  const pageNameMap = Object.keys(pageNameTypeMap).reduce((o, k) => {
    o[k] = getPageNameByType(pageName, pageNameTypeMap[k]);
    return o;
  }, {});

  // FIXED: pageName 路径默认中划线，模板title默认驼峰，均可以任意

  var _ref3 = yield getOutputDir(program, {
    pageNameMap: pageNameMap,
    configLayout: configLayout
  });

  const outputDir = _ref3.outputDir,
        layoutFile = _ref3.layoutFile,
        layoutTitle = _ref3.layoutTitle,
        hasPackageJson = _ref3.hasPackageJson;


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


  _utils.hint.warn('[Info] Mode:', 'init-page');
  (0, _utils.hint)('[Info] Template:', template);
  (0, _utils.hint)('[Info] Repo:', repo);
  (0, _utils.hint)('[Info] Tmp:', tmp);
  (0, _utils.hint)('[Info] OutputDir:', outputDir);

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
    // TODO: pageName 必须使用驼峰
    (0, _utils.copyAndReplace)(tmp, outputDir, {
      pageName: pageNameMap.template,
      configLayout: configLayout
    }, ['layout.html']);

    if (configLayout) {
      // TODO: pageName 默认使用驼峰，可以使用任何
      (0, _utils.copyAndReplaceForFile)(`${tmp}/layout.html`, layoutFile, {
        title: layoutTitle,
        pageName: pageNameMap.template_layout
      });
    }

    // 修改package.json
    if (hasPackageJson) {
      // TODO: entry的名称，默认使用中划线，可以使用任何
      yield editPackageJsonPages(program, {
        pageNameMap: pageNameMap,
        outputDir: outputDir,
        layoutFile: layoutFile,
        configLayout: configLayout
      });
    }
    _utils.hint.success('[Done]');
  } catch (ex) {
    _utils.hint.error('[Fail] copy template files to dest');
    console.error(ex);
  }
}

// 确定最终的仓库完整地址
// 更多 template 补全预测逻辑在这里
function getFullGitReps(_ref4) {
  let template = _ref4.template;


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

function getTempPath(_ref5) {
  let program = _ref5.program,
      template = _ref5.template;

  const tmp = _path2.default.join(_userHome2.default, '.kylin-templates', template.replace(/\//g, '-'));
  // 清理一下tmp目录
  _rimraf2.default.sync(tmp);
  return tmp;
}

function getRepo(_ref6) {
  let program = _ref6.program,
      host = _ref6.host,
      template = _ref6.template;

  const url = `git@${host}:${template}.git`;
  return url;
}

function* gitlabClone(_ref7) {
  let repo = _ref7.repo,
      tmp = _ref7.tmp,
      program = _ref7.program;


  const result = yield (0, _utils.exec)(`git clone --progress ${repo} -b master ${tmp}`, { slient: true });

  // 看下目录是否存在，如果目录存在，认为clone成功
  const exists = _fs2.default.existsSync(tmp);

  if (!exists) {
    throw new Error(`destination "${tmp}" not found`);
  }

  // git打出来的都在 stderr上
  return result.stderr;
}
module.exports = exports['default'];