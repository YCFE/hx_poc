'use strict';

var _decorators = require('../../../common/decorators');

let B = _decorators.Component.Object({})(function ComponentBuilder() {
  const component = {
    watch: {
      a(newVal) {},
      b: {
        handler: 'ccc'
      }
    },
    name: 'B',
    methods: {
      ccc: function (newVal) {},
      onChange: function (newVal) {},
      onChange2: function (newVal) {}
    }
  };
  ;
  component.watch = component.watch || {};
  {
    component.watch['c'] = {} || {};
    component.watch['c']['handler'] = 'onChange';
  }
  {
    component.watch['d'] = {
      deep: true
    } || {};
    component.watch['d']['handler'] = 'onChange2';
  }
  return component;
});