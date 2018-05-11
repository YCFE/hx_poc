'use strict';

exports.__esModule = true;
exports.processMethodList = processMethodList;

var _computed = require('./computed');

var Computed = _interopRequireWildcard(_computed);

var _lifecycle = require('./lifecycle');

var Lifecycle = _interopRequireWildcard(_lifecycle);

var _method = require('./method');

var Method = _interopRequireWildcard(_method);

var _watch = require('./watch');

var Watch = _interopRequireWildcard(_watch);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function processMethodList(methodList, state, visitedMap, path) {
  var _state$opts = state.opts,
      className = _state$opts.className,
      propertyName = _state$opts.propertyName;


  var properties = [];
  var statements = [];

  [Computed, Lifecycle, Method, Watch].forEach(function (processor) {

    var result = processor.processMethodList(methodList, visitedMap, state, path);

    properties = properties.concat(result.properties);
    statements = statements.concat(result.statements);
  });

  return {
    properties: properties,
    statements: statements
  };
}