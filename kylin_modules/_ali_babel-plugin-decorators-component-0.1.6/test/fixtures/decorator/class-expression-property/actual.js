import { Component, Property } from '../../../common/decorators';

@Component
class B {
  @Property
  data = {
    a: 1,
    d: this.b
  };

  @Component.Property
  props = {
    b: String
  };
  
  component = {
    c: 1
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
}