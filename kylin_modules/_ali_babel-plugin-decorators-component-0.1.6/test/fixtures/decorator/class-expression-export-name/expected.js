'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.B = undefined;

var _decorators = require('../../../common/decorators');

let B = exports.B = _decorators.Component.Object({})(function ComponentBuilder() {
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
    computed: {
      c: {
        set: function (v) {
          console.log('set c', v, this);
        },
        get: function () {
          console.log('get c', this);
        }
      }
    },
    created: function () {
      console.log('created', this);
    },
    methods: {
      m: function () {
        console.log('method', this);
      }
    }
  };
  ;
  return component;
});