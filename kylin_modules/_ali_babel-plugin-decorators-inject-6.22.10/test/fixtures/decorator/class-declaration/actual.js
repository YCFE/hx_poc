import { Component, Property, PropertyIgnore } from '../../../common/decorators';

class A {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}

@Component
class B {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}