'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = init;

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

var _ls = require('../ls');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const appIdPrompts = [{
  name: 'appId',
  type: 'input',
  message: `离线应用请输入(appId)，无则置空`,
  default: ''
}];

const destPrompts = [{
  name: 'currentDest',
  type: 'confirm',
  default: false,
  message: `是否在${_chalk2.default.yellow('当前目录')}初始化工程？`
}];

function* getInitAppInfo(program) {
  const ans = yield (0, _utils.question)(appIdPrompts);
  return ans;
}

function* getDest(program) {
  const ans = yield (0, _utils.question)(destPrompts);
  return ans;
}

function* getTemplateSelect(program, repos) {
  const ans = yield (0, _utils.question)({
    name: 'template',
    type: 'list',
    message: `未输入初始模板名，默认从${_chalk2.default.yellow('kylin-templates')}拉取: `,
    choices: repos.map(line => ({
      name: line.graceful,
      value: line.path,
      short: line.path
    }))
  });
  return ans;
}

function* init(program) {

  program.templatePath = program.t = program.t || 'kylin_templates';

  const args = program.args,
        cwd = program.cwd;

  let template = args[0];

  // 如果 template 为空

  // 进行 kylin ls 逻辑提示
  if (!template) {

    _utils.hint.warn(`[Init]`, _chalk2.default.yellow('# kylin init <template-name>'));
    // 进行ls查询
    const gracefulRepos = yield (0, _ls.lsGroup)('kylin-templates', 3);
    const templateAns = yield getTemplateSelect(program, gracefulRepos);

    template = templateAns.template;
  }

  var _ref = yield getInitAppInfo(program);

  const appId = _ref.appId;


  let destDir = program.cwd;

  const dest = args[1];
  // 有无输入初始化目录
  if (!dest) {
    var _ref2 = yield getDest(program);

    const currentDest = _ref2.currentDest;

    // 二次确认在当前目录初始化

    if (currentDest) {
      destDir = program.cwd;
    } else {
      // 默认选否 或者 否，直接报错中断流程，提示用户通过cli设定目录

      const msg = `${_chalk2.default.red('不在当前目录创建请通过cli确定初始化路径')}${_chalk2.default.yellow('\n  # kylin init --help\n  # kylin init <templateName> <destDir>')}`;
      _utils.hint.error(`CLI`, msg);
      throw new Error(msg);
    }
  } else {
    destDir = _path2.default.resolve(program.cwd, dest);
  }

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

  (0, _utils.hint)('[Info] Template:', template);
  (0, _utils.hint)('[Info] Repo:', repo);
  (0, _utils.hint)('[Info] Tmp:', tmp);

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
    (0, _utils.copyAndReplace)(tmp, destDir, {
      appId: appId
    });

    // 善后处理
    // 如果存在文件 再删除，如果不存在就不处理了
    if (!appId) {
      const hpmFilePath = `${cwd}${_path2.default.sep}hpmfile.json`;
      if (_fs2.default.existsSync(hpmFilePath)) {
        _fs2.default.unlinkSync(hpmFilePath);
      }
    }

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