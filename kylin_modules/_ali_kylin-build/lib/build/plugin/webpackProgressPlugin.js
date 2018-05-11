'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WebpackProgressPlugin;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function WebpackProgressPlugin() {

  function handler(percentage, msg) {

    const percent = (percentage * 100).toFixed(1);
    process.stdout.write(`\r${_chalk2.default.green(`[${percent}%]`)} ${msg}                      `);

    if (msg === 'emit' || msg === 'optimize' || percentage >= 0.999) {
      console.log();
    }
  }

  return new _webpack2.default.ProgressPlugin(handler);
}
module.exports = exports['default'];