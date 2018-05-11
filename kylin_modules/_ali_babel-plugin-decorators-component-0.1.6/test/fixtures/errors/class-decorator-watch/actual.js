import { Component, Property, Watch } from '../../../common/decorators';
const ShouldError = function () {};

@Component
class B {
  data = {
    a: 1,
    d: this.b
  };
  props = {
    b: String
  }
  component = {
    c: 1
  }
  get c() {
    console.log('get c', this);
  }
  set c(v) {
    console.log('set c', v, this);
  }
  @Watch('a')
  @Property
  m() {
    console.log('method', this);
  }
  created() {
    console.log('created', this);
  }
}