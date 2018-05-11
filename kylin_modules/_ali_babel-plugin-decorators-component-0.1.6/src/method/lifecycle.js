import * as t from 'babel-types';
import template from 'babel-template';
import { getObjectProperty } from '../utils';

export const lifeCycleHookMap = {
  'beforeCreate': true,
  'created': true,
  'beforeMount': true,
  'mounted': true,
  'beforeUpdate': true,
  'updated': true,
  'beforeDestroy': true,
  'destroyed': true,
  'activated': true,
  'deactivated': true,
  'render': true,
};

function filter(d) {
  return d.kind === 'method' && lifeCycleHookMap[d.key.name] 
}

export function processMethodList(list, visitedMap, state, path) {

  const computed = {};

  let properties = [];
  let statements = [];

  list.filter(filter).forEach(classMethod => {

    if ( classMethod.key.name === 'render' ) {
      if ( state.opts.noJSX ) {
        throw path.hub.file.buildCodeFrameError(classMethod, `JSX render is not supported in Component`)
      }
    }

    properties.push(
      getObjectProperty(classMethod.key.name, 
        t.functionExpression(null, classMethod.params, classMethod.body, classMethod.generator, classMethod.async)
      )
    )

  });
 
  return {
    properties,
    statements
  }

}

