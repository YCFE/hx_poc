function assert(b) {
  if (!b) throw new Error(b)
}

function Component(cls) {
  assert(cls.name === 'B')
  console.log('Component', cls.name)
}
const map = Object.create(null);
function Property(target, key, desc) {
  map[key] = map[key] || 0;
  map[key] ++;

  assert(map[key] <= 1);

  console.log('Property', key)
}

Component.Property = Property;

export class A {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}

@Component
export class B {
  static a = 1;
  b = 2;
  static c() {}
  d() {}
}