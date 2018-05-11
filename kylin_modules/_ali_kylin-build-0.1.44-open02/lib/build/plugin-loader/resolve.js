"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvePlugin = resolvePlugin;
exports.standardizeName = standardizeName;

var _resolve = require("resolve");

var _resolve2 = _interopRequireDefault(_resolve);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EXACT_RE = /^module:/;
const BABEL_PLUGIN_PREFIX_RE = /^(?!@|module:|[^/\/]+[/\/]|kylin-plugin-)/;
const OTHER_PLUGIN_ORG_RE = /^(@(?!kylin[/\/])[^/\/]+[/\/])(?!kylin-plugin-|[^/\/]+[/\/])/;

function resolvePlugin(name, dirname) {
  return resolveStandardizedName(name, dirname);
}

function standardizeName(name) {
  // Let absolute and relative paths through.
  if (_path2.default.isAbsolute(name)) return name;
  return name
  // foo -> @ali/kylin-plugin-foo
  .replace(BABEL_PLUGIN_PREFIX_RE, `@ali/kylin-plugin-`)
  // @foo/mypreset -> @foo/kylin-plugin-mypreset
  .replace(OTHER_PLUGIN_ORG_RE, `$1kylin-plugin-`)
  // module:mypreset -> mypreset
  .replace(EXACT_RE, "");
}

function resolveStandardizedName(name) {
  let dirname = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.cwd();

  const standardizedName = standardizeName(name);

  try {
    return _resolve2.default.sync(standardizedName, { basedir: dirname });
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") throw e;

    try {
      return require.resolve(standardizedName);
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND") throw e;

      if (standardizedName !== name) {
        let resolvedOriginal = false;
        try {
          require.resolve(name);
          resolvedOriginal = true;
        } catch (e2) {}

        if (resolvedOriginal) {
          // eslint-disable-next-line max-len
          e.message += `\n- If you want to resolve "${name}", use "module:${name}"`;
        }
      }

      throw e;
    }
  }

  // try {
  //   return resolve.sync(standardizedName, { basedir: dirname });
  // } catch (e) {
  //   if (e.code !== "MODULE_NOT_FOUND") throw e;
  //
  //   if (standardizedName !== name) {
  //     let resolvedOriginal = false;
  //     try {
  //       resolve.sync(name, { basedir: dirname });
  //       resolvedOriginal = true;
  //     } catch (e2) {}
  //
  //     if (resolvedOriginal) {
  //       // eslint-disable-next-line max-len
  //       e.message += `\n- If you want to resolve "${name}", use "module:${name}"`;
  //     }
  //   }
  //
  //   throw e;
  // }
}