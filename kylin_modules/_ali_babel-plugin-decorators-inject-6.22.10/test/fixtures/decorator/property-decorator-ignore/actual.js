import { Component, Property, PropertyIgnore } from '../../../common/decorators';

@Component
class B {
  @PropertyIgnore
  static a = 1;
  @PropertyIgnore
  b = 2;

  static c = 1;
  d = 2;
}
