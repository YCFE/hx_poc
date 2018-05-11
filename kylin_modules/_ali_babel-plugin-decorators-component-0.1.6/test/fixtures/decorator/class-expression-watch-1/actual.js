import { Component, Property, Watch } from '../../../common/decorators';

@Component
class B {
  watch = {
    a(newVal) {

    },
    b: {
      handler: 'ccc'
    }
  };
  ccc(newVal) {

  }
  @Watch('c')
  onChange(newVal) {

  }
  @Watch('d', {
    deep: true
  })
  onChange2(newVal) {

  }
}