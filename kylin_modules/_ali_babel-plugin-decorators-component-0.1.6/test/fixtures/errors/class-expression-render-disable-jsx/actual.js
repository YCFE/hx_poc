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
  component = {
    c: 1
  }
  render() {

  }
}