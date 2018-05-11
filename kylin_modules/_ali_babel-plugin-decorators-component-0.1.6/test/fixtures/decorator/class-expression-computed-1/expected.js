'use strict';

var _decorators = require('../../../common/decorators');

let B = _decorators.Component.Object({})(function ComponentBuilder() {
  const component = {
    name: 'B',
    computed: {
      a: {
        get: function () {
          return 1;
        }
      },
      b: {
        set: function (v) {},
        get: function () {}
      }
    },
    methods: {}
  };
  ;
  return component;
});