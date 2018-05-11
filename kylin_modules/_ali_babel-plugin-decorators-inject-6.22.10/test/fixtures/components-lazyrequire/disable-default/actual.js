import { Component, Property, PropertyIgnore } from '../../../common/decorators';
import A from './a';

@Component
class D {

  components = {
    A
  }

}