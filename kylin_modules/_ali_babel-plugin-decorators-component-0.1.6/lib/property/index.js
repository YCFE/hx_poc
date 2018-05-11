'use strict';

exports.__esModule = true;
exports.processPropertyList = processPropertyList;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _data = require('./data');

var Data = _interopRequireWildcard(_data);

var _other = require('./other');

var Other = _interopRequireWildcard(_other);

var _utils = require('../utils');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function processPropertyList(propertyList, state, path) {
  var _state$opts = state.opts,
      className = _state$opts.className,
      propertyName = _state$opts.propertyName,
      strict = _state$opts.strict,
      noJSX = _state$opts.noJSX;


  var properties = [];
  var propertyKeyMap = {};

  propertyList.forEach(function (classProperty) {
    var key = classProperty.key.name;

    switch (key) {
      case 'data':
        {
          var objectPropertyPair = Data.processProperty(classProperty, state);
          if (objectPropertyPair) {
            properties.push(objectPropertyPair);
            propertyKeyMap['data'] = true;
          }
        }
        break;
      case 'methods':
      case 'computed':
        {
          // 抛错
          if (strict) {
            throw path.hub.file.buildCodeFrameError(classProperty, 'ClassProperty "' + key + '" is deprecated. please use ' + (key === 'computed' ? 'getter/setter' : '') + ' ClassMethod instead.');
            break;
          }
        }
      case 'watch':
        {
          // 抛错
          if (strict) {
            throw path.hub.file.buildCodeFrameError(classProperty, 'ClassProperty "' + key + '" is deprecated. please use @Watch Decorator to decorate ClassMethod instead.');
            break;
          }
        }

      case 'components':
        {

          if (key === 'components') {
            (0, _utils.printCodeFrameWarning)(path.hub.file, classProperty, 'ClassProperty "' + key + '" is deprecated. please use <dependency> tag to import component instead.' + ('\nsee "' + _chalk2.default.gray("http://kylin.alipay.net/kylin/framework/component/spec.html#dependency%E6%A0%87%E7%AD%BE") + '" for more infomation.\n'));
          }
        }
      case 'props':
      case 'filters':
      case 'directives':
      case 'name':
      default:
        {
          if (key === 'render') {
            if (noJSX) {
              throw path.hub.file.buildCodeFrameError(classProperty, 'JSX render is not supported in Component');
            }
          }
          var _objectPropertyPair = Other.processProperty(classProperty, state);
          if (_objectPropertyPair) {
            properties.push(_objectPropertyPair);
            propertyKeyMap[key] = true;
          }
        }
        break;
    }
  });

  // 如果没有name，那塞进去
  if (!propertyKeyMap['name'] && t.isIdentifier(path.node.id)) {
    properties.push((0, _utils.getObjectProperty)('name', t.stringLiteral(path.node.id.name)));
  }

  return {
    properties: properties,
    propertyKeyMap: propertyKeyMap
  };
};