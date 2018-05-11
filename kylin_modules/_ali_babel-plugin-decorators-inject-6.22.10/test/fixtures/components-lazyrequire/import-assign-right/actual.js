import { Component, Property, PropertyIgnore } from '../../../common/decorators';
import A from './a';

const T = A;

@Component
class D {

  components = {
    A
  }

}
