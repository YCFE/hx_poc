import { Component, Property } from '../../../common/decorators';

@Component
class B {
  data = {
    a: 1,
    d: this.b
  }
  props = {
    b: String
  }
  static m() {
    console.log('method', this);
  }
  created() {
    console.log('created', this);
  }
}