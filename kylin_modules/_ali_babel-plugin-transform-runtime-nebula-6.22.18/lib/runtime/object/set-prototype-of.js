'use strict';

module.exports = Object['setPrototypeOf'] ? Object['setPrototypeOf'] : function _setPrototypeOf(O, proto) {
  O.__proto__ = proto;
  return O;
};