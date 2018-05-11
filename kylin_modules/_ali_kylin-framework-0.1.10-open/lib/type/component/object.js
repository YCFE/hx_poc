'use strict';

exports.__esModule = true;
exports.ComponentObjectModifier = ComponentObjectModifier;

var _index = require('../property/index.js');

var _connect = require('../connect');

function ComponentObjectModifier() {
  var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var connectFunc = null;
  var connectFuncExec = false;
  var hasMapExec = false;
  if ((0, _connect.hasConnectProperty)(meta)) {

    connectFuncExec = !!meta.mapExec;
    hasMapExec = typeof meta.mapExec !== 'undefined';
    connectFunc = (0, _connect.generateConnectFunc)(meta);
  }

  return function modify(objFunc) {

    var options = objFunc();

    (0, _index.modifyProperty)(options);

    if (connectFunc) {
      if (hasMapExec) {
        if (connectFuncExec) {
          options = connectFunc(options);
        } else {
          options['__kylin_connect_function__'] = connectFunc;
        }
      } else {
        var wrapOptions = connectFunc(options);
        wrapOptions['__kylin_connect_wrap__'] = {
          func: connectFunc,
          options: options
        };

        options = wrapOptions;
      }
    } else {}

    return options;
  };
}
//# sourceMappingURL=object.js.map