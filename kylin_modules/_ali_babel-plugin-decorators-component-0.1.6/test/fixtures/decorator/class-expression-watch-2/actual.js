import { Component, Property, Watch } from '../../../common/decorators';

@Component
class B {
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