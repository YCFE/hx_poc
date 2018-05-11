'use strict';

var _dec, _class;

var _decorators = require('../../../common/decorators');

const ShouldError = function () {};

let B = (_dec = function () {}, _dec(_class = class B {
  constructor() {
    this.data = {
      a: 1,
      d: this.b
    };
    this.props = {
      b: String
    };
    this.component = {
      c: 1
    };
  }

  get c() {
    console.log('get c', this);
  }
  set c(v) {
    console.log('set c', v, this);
  }
  m() {
    console.log('method', this);
  }
  created() {
    console.log('created', this);
  }
}) || _class);