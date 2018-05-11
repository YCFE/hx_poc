'use strict';

var _decorators = require('../../../common/decorators');

let B = _decorators.Component.Object({})(function ComponentBuilder() {
  const component = {
    computed: {
      d() {},
      e: {
        get() {}
      }
    },
    name: 'B',
    methods: {}
  };
  ;
  component.computed = component.computed || {};
  component.computed['a'] = component.computed['a'] || {};
  component.computed['a'] = {
    get: function () {
      return 1;
    },
    set: null
  };
  component.computed['b'] = component.computed['b'] || {};
  component.computed['b'] = {
    get: function () {},
    set: null
  };
  component.computed['e'] = component.computed['e'] || {};
  component.computed['e'] = {
    get: null,
    set: function (v) {}
  };
  return component;
});