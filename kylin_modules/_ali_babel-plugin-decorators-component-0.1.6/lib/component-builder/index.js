'use strict';

exports.__esModule = true;
exports.ComponentBuilder = undefined;

var _objectDestructuringEmpty2 = require('babel-runtime/helpers/objectDestructuringEmpty');

var _objectDestructuringEmpty3 = _interopRequireDefault(_objectDestructuringEmpty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _data = require('./property/data');

var _data2 = _interopRequireDefault(_data);

var _props = require('./property/props');

var _props2 = _interopRequireDefault(_props);

var _default = require('./property/default');

var _default2 = _interopRequireDefault(_default);

var _watch = require('./property/watch');

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComponentBuilder = exports.ComponentBuilder = function () {
  function ComponentBuilder(_path, _state) {
    (0, _classCallCheck3.default)(this, ComponentBuilder);

    this.path = _path;
    this.state = _state;
  }

  ComponentBuilder.prototype.loadProperty = function loadProperty(_ref) {
    (0, _objectDestructuringEmpty3.default)(_ref);
  };

  ComponentBuilder.prototype.loadProperties = function loadProperties() {
    this.loadProperty(_data2.default);
    this.loadProperty(_props2.default);
    this.loadProperty(_default2.default);
    this.loadProperty(_watch2.default);
  };

  return ComponentBuilder;
}();