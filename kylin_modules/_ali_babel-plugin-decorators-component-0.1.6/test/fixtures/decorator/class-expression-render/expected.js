'use strict';

var _decorators = require('../../../common/decorators');

let B = _decorators.Component.Object({})(function ComponentBuilder() {
  const component = {
    data: function () {
      return {
        a: 1,
        d: this.b
      };
    },
    props: {
      b: String
    },
    component: {
      c: 1
    },
    name: 'B',
    render: function () {},
    methods: {}
  };
  ;
  return component;
});