'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ls;
exports.lsGroup = lsGroup;

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

var _urllib = require('urllib');

var _urllib2 = _interopRequireDefault(_urllib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* ls(program) {
  const args = program.args,
        cwd = program.cwd;

  // 调用 luna-server 提供的接口
  // 默认使用 kylin-templates 仓库

  const groupName = args[0] || 'kylin-templates';

  const gracefulRepos = yield lsGroup(groupName);

  if (gracefulRepos.length == 0) {
    _utils.hint.warn(`\n[List]`, `检索库[${_chalk2.default.yellow(groupName)}]不存在有效kylin模板`);
  } else {
    _utils.hint.success(`\n检索到${gracefulRepos.length}个有效kylin模板\n`);
    gracefulRepos.forEach(line => {
      console.log(line.graceful);
    });
    console.log('');
  }
}

function* lsGroup(groupName) {
  let paddingNum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  // urllib 请求json数据
  const repos = yield getRepo({
    groupName: groupName
  });

  const gracefulRepos = getGracefulRepos({
    groupName: groupName,
    repos: repos,
    paddingNum: paddingNum
  });

  return gracefulRepos;
}

function getGracefulRepos(_ref) {
  let groupName = _ref.groupName;
  var _ref$repos = _ref.repos;
  let repos = _ref$repos === undefined ? [] : _ref$repos;
  var _ref$paddingNum = _ref.paddingNum;
  let paddingNum = _ref$paddingNum === undefined ? 0 : _ref$paddingNum;


  const cleaRepos = repos.filter(d => {
    const desc = d.description || '';
    return (/^\[ls\]/.test(desc)
    );
  }).map(d => {

    d.description = d.description || '';
    d.description = d.description.replace(/^\[ls\]\s*/, '');

    return d;
  });

  if (cleaRepos.length === 0) {
    return [];
  } else {
    // 计算下如何对齐 description
    // 计算最长的desc

    const maxDisplayNameLength = cleaRepos.reduce((len, obj) => Math.max(len, getDisplayName(obj).length), 0);

    return cleaRepos.map(repoInfo => {
      repoInfo.graceful = `${getRepoDisplayName(repoInfo, maxDisplayNameLength, paddingNum)}- ${repoInfo.description}`;
      // 按行打印
      return repoInfo;
    });
  }
}

function getDisplayName(repoInfo) {
  return ` - "${repoInfo.path}" `;
}

function getRepoDisplayName(repoInfo, max, paddingNum) {
  const display = getDisplayName(repoInfo);
  const tabCount = Math.ceil((max - display.length + (display.length + paddingNum) % 8) / 8);

  return ` - "${_chalk2.default.yellow(repoInfo.path)}" ` + new Array(tabCount + 1).join('\t');
}

function* getRepo(_ref2) {
  let groupName = _ref2.groupName;

  // 如果 Error 就直接抛到最外层吧
  var _ref3 = yield _urllib2.default.request(`http://luna.dockerlab.alipay.net/api/getLibrariesFromGitlab?groupName=${groupName}`, {
    method: 'GET',
    dataType: 'json'
  });

  const status = _ref3.status,
        data = _ref3.data;


  let msg = '';

  if (status === 200) return data;
  if (status === 404) {
    msg = `检索仓库[${_chalk2.default.yellow(groupName)}]不存在`;
  } else {
    msg = `未知错误${status}: ${JSON.stringify(data)}`;
  }

  _utils.hint.error(`[List]`, msg);
  throw new Error('ListData');
}