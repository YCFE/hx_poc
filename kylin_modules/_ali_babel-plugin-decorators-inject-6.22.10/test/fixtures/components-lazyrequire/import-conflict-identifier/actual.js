import { Component, Property, PropertyIgnore } from '../../../common/decorators';
import A from './a';
import B from './b';

function C() {

  const B = 1;

  @Component
  class D {

    components = {
      A,
      B
    }

  }


}