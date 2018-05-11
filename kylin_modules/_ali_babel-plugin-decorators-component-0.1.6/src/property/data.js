import * as t from 'babel-types';
import template from 'babel-template';
import { validPropertyDecoratorLength, getObjectProperty } from '../utils';

const buildComponentPropertyDataBuilder = template(`
  (function () {
    return $0;
  })
`);

export function processProperty(classProperty, state) {
  let ret;
  const len = validPropertyDecoratorLength(classProperty.decorators, state);

  // 多个Property, Component.Property
  // 只放一次，
  // 必须有才放
  if ( len === classProperty.decorators.length && len >= 1 ) {
    // 往里面塞一个
    ret = (
      getObjectProperty(
        'data',
        buildComponentPropertyDataBuilder(
          classProperty.value
        )
      )
    );

  } else {
    // TODO 打出警告
    
  }

  return ret;
}

