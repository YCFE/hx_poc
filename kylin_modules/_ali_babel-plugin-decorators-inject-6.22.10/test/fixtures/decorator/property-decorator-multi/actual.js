import { Component, Property, PropertyIgnore } from '../../../common/decorators';

function FakeDec() {}
function FakeDec2() {}

@Component
class B {

  @FakeDec
  @FakeDec2
  static a = 1;

  @FakeDec
  @FakeDec2
  b = 2;

  @FakeDec
  static c = 1;

  @FakeDec
  d = 2;
}
