import * as t from 'babel-types';
import template from 'babel-template';

import { validPropertyDecoratorLength, getObjectProperty } from '../utils';

export function processProperty(classProperty, state) {
  let ret;
  const len = validPropertyDecoratorLength(classProperty.decorators, state);
  // 多个Property, Component.Property
  // 只放一次，
  // 什么都没有的话，不放！
  if ( len ===  classProperty.decorators.length && len >= 1 ) {

    ret = (
      getObjectProperty(
        classProperty.key.name,
        classProperty.value
      )
    );

  } else {
    
  }

  return ret;
}

