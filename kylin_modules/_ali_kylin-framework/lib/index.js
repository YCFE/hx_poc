'use strict';

exports.__esModule = true;
exports.Watch = exports.Property = exports.Component = exports.Page = exports.Store = undefined;
exports.use = use;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _index = require('./type/utils/index.js');

var _page = require('./type/page.js');

var _index2 = require('./type/component/index.js');

var _index3 = require('./type/property/index.js');

var _plugins = require('./type/plugins.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof window !== 'undefined') {
  if (!(0, _index.isSupportPromise)(window.Promise)) {
    var localPromise = require('babel-runtime/core-js/promise');
    window.Promise = localPromise.default || localPromise;
  }
}

if (typeof window === 'undefined' || !window.Vue) {
  _vue2.default.use(_vuex2.default);
}

function use(plugin) {
  return _vue2.default.use(plugin);
}
var Store = exports.Store = _vuex2.default.Store;

_index2.Component.Property = _index3.Property;
_index2.Component.Object = _index2.ObjectFunc;

exports.Page = _page.Page;
exports.Component = _index2.Component;
exports.Property = _index3.Property;
exports.Watch = _index3.Watch;


try {
  (0, _plugins.loadPlugin)({
    Vue: _vue2.default,
    use: use,
    Page: _page.Page,
    Component: _index2.Component,
    Property: _index3.Property,
    ObjectFunc: _index2.ObjectFunc,
    Watch: _index3.Watch,
    Store: Store,
    Vuex: _vuex2.default
  }, module.exports);
} catch (ex) {
  console.error(ex);
  throw ex;
}
//# sourceMappingURL=index.js.map