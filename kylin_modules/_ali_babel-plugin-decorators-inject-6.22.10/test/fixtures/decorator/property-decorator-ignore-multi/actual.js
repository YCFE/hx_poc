import { Component, Property, PropertyIgnore } from '../../../common/decorators';

function FakeDec() {}

@Component
class B {
  @PropertyIgnore
  @FakeDec
  static a = 1;

  @PropertyIgnore
  @FakeDec
  b = 2;

  @FakeDec
  @Component.Property
  static c = 1;

  @FakeDec
  @Component.Property
  d = 2;
}
