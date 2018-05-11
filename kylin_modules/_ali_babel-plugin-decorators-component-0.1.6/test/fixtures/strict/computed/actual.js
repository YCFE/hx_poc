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
  computed = {
    c() {

    }
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
}