import { Component, Property, PropertyIgnore } from '../../../common/decorators';

function FakeDec() {}

class A {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}

@FakeDec
class B {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}

@Component
@FakeDec
class C {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}

@FakeDec
@Component
class D {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}