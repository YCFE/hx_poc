'use strict';

exports.__esModule = true;
exports.validPropertyDecoratorLength = validPropertyDecoratorLength;
exports.getObjectProperty = getObjectProperty;
exports.printCodeFrameWarning = printCodeFrameWarning;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelCodeFrame = require('babel-code-frame');

var _babelCodeFrame2 = _interopRequireDefault(_babelCodeFrame);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function validPropertyDecoratorLength(decorators, state) {
  var _state$opts = state.opts,
      className = _state$opts.className,
      propertyName = _state$opts.propertyName;


  return decorators.filter(function (d) {
    return t.isMemberExpression(d.expression) && d.expression.object.name === className && d.expression.property.name === propertyName || t.isIdentifier(d.expression) && d.expression.name === propertyName;
  }).length;
}

var buildComponentPropertyKeyValueBuilder = (0, _babelTemplate2.default)('\n  ({\n    $0: $1\n  })\n');

function getObjectProperty(keyStr, val) {
  return buildComponentPropertyKeyValueBuilder(t.identifier(keyStr), val).expression.properties[0];
};

function printCodeFrameWarning(file, node, message) {

  try {
    var loc = node.loc.start;
    var code = file.code;
    var filename = file.opts.filename;

    var codeFrameMessage = (0, _babelCodeFrame2.default)(code, loc.line, loc.column + 1, {
      highlightCode: false,
      forceColor: false
    });

    console.error('\n' + _chalk2.default.yellow("[Deprecated]") + ' ' + filename + ':' + loc.line + '\n' + (message + '\n') + ('' + codeFrameMessage));
  } catch (ex) {}
}