'use strict';

var _decorators = require('../../../common/decorators');

let B = _decorators.Component.Object({})(function ComponentBuilder() {
  const component = {
    methods: {
      a(v) {},
      c: b => {}
    },
    name: 'B'
  };
  ;
  component.methods = component.methods || {};

  component.methods['d'] = function (a) {};

  return component;
});