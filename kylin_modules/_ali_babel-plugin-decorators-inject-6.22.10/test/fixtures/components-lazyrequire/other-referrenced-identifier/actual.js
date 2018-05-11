import { Component, Property, PropertyIgnore } from '../../../common/decorators';
import A from './a';

@Component
class D {

  components = {
    B,
    A
  }

}

import B from './b';

console.log(B)