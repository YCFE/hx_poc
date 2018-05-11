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
    name: 'B',
    mounted: async function () {
      console.log('mounted', this);
      await delay(100);
    },
    created: function () {
      console.log('created', this);
    },
    methods: {
      m: async function () {
        console.log('m', this);
        await delay(100);
      }
    }
  };
  ;
  return component;
});