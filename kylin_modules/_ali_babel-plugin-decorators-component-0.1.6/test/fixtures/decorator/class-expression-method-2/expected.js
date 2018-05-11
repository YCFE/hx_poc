'use strict';

var _decorators = require('../../../common/decorators');

let B = _decorators.Component.Object({})(function ComponentBuilder() {
  const component = {
    name: 'B',
    methods: {
      a: function (v) {
        console.log(this);
      },
      d: function (a) {}
    }
  };
  ;
  return component;
});