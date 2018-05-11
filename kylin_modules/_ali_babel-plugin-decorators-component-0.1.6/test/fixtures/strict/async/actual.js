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
  async m() {
    console.log('m', this);
    await delay(100);
  }
  async mounted() {
    console.log('mounted', this);
    await delay(100);
  }
  created() {
    console.log('created', this);
  }
}