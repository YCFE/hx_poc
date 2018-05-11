import * as Computed from './computed';
import * as Lifecycle from './lifecycle';
import * as Method from './method';
import * as Watch from './watch';

export function processMethodList(methodList, state, visitedMap, path) {

  const {
    className,
    propertyName
  } = state.opts; 

  let properties = [];
  let statements = [];

  [
    Computed,
    Lifecycle,
    Method,
    Watch
  ].forEach(processor => {

    const result = processor.processMethodList(
      methodList, visitedMap, state, path
    );

    properties = properties.concat( result.properties );
    statements = statements.concat( result.statements );

  })

  return {
    properties,
    statements
  }

}