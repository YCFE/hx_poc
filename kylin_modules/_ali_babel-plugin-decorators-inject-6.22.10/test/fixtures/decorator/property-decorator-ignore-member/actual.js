import { Component, Property, PropertyIgnore } from '../../../common/decorators';

@Component
class B {
  @Component.Property
  static a = 1;
  @Component.Property
  b = 2;

  static c = 1;
  d = 2;
}
