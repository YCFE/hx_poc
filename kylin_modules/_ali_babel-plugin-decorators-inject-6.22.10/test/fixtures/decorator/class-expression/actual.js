import { Component, Property, PropertyIgnore } from '../../../common/decorators';

const A = class {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}


const B = @Component
class B {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}