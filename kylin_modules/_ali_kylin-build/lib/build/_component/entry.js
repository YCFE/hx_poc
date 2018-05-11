'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveEntry = resolveEntry;

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _index = require('../../utils/index');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveEntry(program, kylinComponent) {
  const entry = kylinComponent.entry;

  const ret = {};

  if (!Array.isArray(entry)) {
    _index.hint.error('[Entry]', `kylinComponent.entry should be Array. such as ["js", "vue"]`);
    throw new Error(`kylinComponent.entry should be Array. such as ["js", "vue"]`);
  }

  const suffix = entry.join('|');
  const files = _glob2.default.sync(`**/*.@(${suffix})`, {
    cwd: _path2.default.resolve(program.cwd, kylinComponent.sourceDir)
  });

  (0, _index.hint)('[Entry]', `files:`);

  files.forEach(file => {
    ret[`${file}`] = `./${file}`;
    console.log(`  * ${file}`);
  });

  return ret;
}