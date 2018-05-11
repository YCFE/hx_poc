import * as t from 'babel-types';
import template from 'babel-template';
import { getObjectProperty } from '../utils';

function filter(d) {
  return d.kind === 'get' || d.kind === 'set'
}

const buildComponentMethodGetSetBuilderComputed = template(`
  component.computed = component.computed || {};
`);

const buildComponentMethodGetSetBuilderComputedKey = template(`
  component.computed[$0] = component.computed[$0] || {};
`);

const buildComponentMethodGetSetBuilderComputedBoth = template(`
  component.computed[$0] = {
    get: $1,
    set: $2
  };
`);

export function processMethodList(list, visitedMap) {

  const computed = {};

  let properties = [];
  let statements = [];

  list.filter(filter).forEach(classMethod => {

    const key = classMethod.key.name;
    computed[key] = computed[key] || {};
    computed[key][classMethod.kind] = t.functionExpression(null, classMethod.params, classMethod.body)

  });
 
  if ( Object.keys(computed).length ) {
    if ( !visitedMap['computed'] ) {

      properties = generatePropertys(computed);

    } else {

      statements = generateStatements(computed);

    }
  }
  

  return {
    properties,
    statements
  }

}


function generatePropertys(computed) {
  const computedProperties = [];
  Object.keys(computed).forEach(k => {

    computedProperties.push(
      getObjectProperty(k, 
        t.objectExpression(
          [
            computed[k].set ? getObjectProperty('set', computed[k].set) : null,
            computed[k].get ? getObjectProperty('get', computed[k].get) : null
          ].filter(Boolean)
        )
      )
    );
  });

  return [
    getObjectProperty('computed', 
      t.objectExpression(computedProperties)
    )
  ];
}

function generateStatements(computed) {
  const statements = [];

  if ( Object.keys(computed).length ) {
    statements.push(
      buildComponentMethodGetSetBuilderComputed()
    );

    Object.keys(computed).forEach(k => {

      statements.push(
        buildComponentMethodGetSetBuilderComputedKey(
          t.stringLiteral(k)
        )
      )
      if ( computed[k].get || computed[k].set ) {
        statements.push(
          buildComponentMethodGetSetBuilderComputedBoth(
            t.stringLiteral(k),
            computed[k].get || t.identifier('null'),
            computed[k].set || t.identifier('null')
          )
        )
      }

    });
  }

  return statements;
}