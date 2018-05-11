'use strict';

exports.__esModule = true;
exports.Page = undefined;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = exports.Page = function () {
  function Page(el) {
    _classCallCheck(this, Page);

    this._init(el);
  }

  Page.prototype._init = function _init(el) {
    var _this = this;

    var optionOrPromise = this.initOptions() || {};

    if (optionOrPromise && typeof optionOrPromise.then === 'function') {
      optionOrPromise.then(function (option) {
        _this._initVue(option, el);
      });
    } else {
      this._initVue(optionOrPromise, el);
    }
  };

  Page.prototype._initVue = function _initVue(option, el) {
    option.el = el;
    option.render = this.render;

    this._vue = new _vue2.default(option);
  };

  Page.prototype.initOptions = function initOptions() {
    return {};
  };

  Page.prototype.render = function render() {
    throw new Error('Derived Page Class should have an explicit "render" function');
  };

  return Page;
}();
//# sourceMappingURL=page.js.map