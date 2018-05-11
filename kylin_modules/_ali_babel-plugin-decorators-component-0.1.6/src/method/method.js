import * as t from 'babel-types';
import template from 'babel-template';
import { lifeCycleHookMap } from './lifecycle';
import { getObjectProperty } from '../utils';

const buildComponentMethodBuilderMethods = template(`
  component.methods = component.methods || {};
`);

const buildComponentMethodBuilderMethodsKey = template(`
  component.methods[$0] = $1;
`);

function filter(d) {
  return d.kind === 'method' && !lifeCycleHookMap[d.key.name] 
}

export function processMethodList(list, visitedMap) {

  const methods = {};

  let properties = [];
  let statements = [];

  list.filter(filter).forEach(classMethod => {

    methods[classMethod.key.name] = t.functionExpression(null, classMethod.params, classMethod.body, classMethod.generator, classMethod.async);

  });
 
  if ( !visitedMap['methods'] ) {

    properties = generatePropertys(methods);

  } else {

    statements = generateStatements(methods);

  }

  return {
    properties,
    statements
  }

}


function generatePropertys(methods) {
  
  const methodsProperties = [];

  Object.keys(methods).forEach(k => {

    methodsProperties.push(
      getObjectProperty(k,
        methods[k]
      )
    );

  });

  return [
    getObjectProperty('methods', 
      t.objectExpression(methodsProperties)
    )
  ];
}

function generateStatements(methods) {
  
  const statements = [];

  statements.push(
    buildComponentMethodBuilderMethods()
  );

  Object.keys(methods).forEach(k => {

    statements.push(
      buildComponentMethodBuilderMethodsKey(
        t.stringLiteral(k),
        methods[k]
      )
    )
    
  });

  return statements;
}