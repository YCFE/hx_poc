import { Component, Property, Watch } from '../../../common/decorators';

@Component
class B {
  computed = {
    d() {

    },
    e: {
      get() {

      }
    }
  };
  get a() {
    return 1;
  }
  get b() {

  }
  set e(v) {
    
  }
}