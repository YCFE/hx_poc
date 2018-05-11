'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRender = getRender;

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRender(program, kylinApp) {

  const env = _nunjucks2.default.configure(program.cwd);

  return function* (viewPath) {
    let contextData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    return new Promise(function (resolve, reject) {
      env.render(viewPath, contextData, function (err, body) {
        if (err) {
          reject(err);
        }
        resolve(body);
      });
    });
  };
}