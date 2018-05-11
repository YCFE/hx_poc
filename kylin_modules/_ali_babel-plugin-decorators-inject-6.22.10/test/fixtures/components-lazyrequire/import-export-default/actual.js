import { Component, Property, PropertyIgnore } from '../../../common/decorators';
import A from './a';

export default A;

@Component
class D {

  components = {
    A
  }

}
