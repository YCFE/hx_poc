import { Component, Property, Watch } from '../../../common/decorators';

@Component
class B {
  data = {
    a: 1,
    d: this.b
  }
  props = {
    b: String
  }
  set c(v) {
    console.log('set c', v, this);
  }
  @Watch('a,b', 1)
  m() {
    console.log('method', this);
  }
  created() {
    console.log('created', this);
  }
}