'use strict';

exports.__esModule = true;
exports.hasConnectProperty = exports.createConnect = exports.connect = undefined;
exports.generateConnectFunc = generateConnectFunc;

var _connect = require('./connect');

var connect = exports.connect = (0, _connect.createConnect)();
exports.createConnect = _connect.createConnect;
exports.hasConnectProperty = _connect.hasConnectProperty;
function generateConnectFunc() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var connectOption = {
    mapStateToProps: obj.mapStateToProps,
    mapMethodsToProps: obj.mapMethodsToProps,
    mapMethodsToEvents: obj.mapMethodsToEvents,
    mapEvents: obj.mapEvents,
    mapMethods: obj.mapMethods,
    mapMutationsToMethods: obj.mapMutationsToMethods,
    mapActionsToMethods: obj.mapActionsToMethods
  };

  obj.mapStateToProps = undefined;
  obj.mapMethodsToProps = undefined;
  obj.mapMethodsToEvents = undefined;
  obj.mapEvents = undefined;
  obj.mapMethods = undefined;
  obj.mapExec = undefined;
  obj.mapMutationsToMethods = undefined;
  obj.mapActionsToMethods = undefined;


  return connect(connectOption);
}
//# sourceMappingURL=index.js.map