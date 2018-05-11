import * as t from 'babel-types';
import template from 'babel-template';
import { lifeCycleHookMap } from './lifecycle';
import { getObjectProperty } from '../utils';

const buildComponentWatchBuilder = template(`
  component.watch = component.watch || {};
`)

const buildComponentWatchOptionBuilder = template(`
  {
    component.watch[$0] = $1 || {};
    component.watch[$0]['handler'] = $2;
  }
`)

function filter(d) {
  return d.kind === 'method' && !lifeCycleHookMap[d.key.name] 
}

function getWatchDecoratorsLength(decorators, state) {

  const {
    watchName
  } = state.opts;

  if (!decorators) return 0;

  const matchDecorators = decorators.filter(
    d => (
      t.isCallExpression(d.expression) &&
      t.isIdentifier(d.expression.callee) &&
      d.expression.callee.name === watchName
    )
  );

  return matchDecorators.length
}

export function processMethodList(list, visitedMap, state, path) {

  const {
    watchName
  } = state.opts;

  const watch = [];

  let properties = [];
  let statements = [];

  list.filter(filter).forEach(classMethod => {

    const decorators = classMethod.decorators;
    const watchDecoratorsLength = getWatchDecoratorsLength(decorators, state);

    // 如果有Watch 且全是watch
    if ( watchDecoratorsLength >=1 && watchDecoratorsLength === decorators.length ) {

      decorators.forEach(decorator => {

        const args = decorator.expression.arguments;
        const watchOption = args[1] || t.objectExpression([]);

        watch.push({
          key: args[0],
          option: watchOption,
          handler: classMethod.key.name
        });

      });

    } else if ( decorators && decorators.length > 0 ) {
      const names = decorators.map(d => (
        d.expression.name || (d.expression.callee && d.expression.callee.name)
      )).filter(Boolean);
      // 如果有别的装饰器，报错
      throw path.hub.file.buildCodeFrameError(classMethod,
        `@${watchName} decorator should not be used with other decorators [${names.filter(d => d!== watchName)}]`
      );
    }

  });
 
  if ( watch.length ) {

    statements = generateStatements(watch, state, path);

  }

  return {
    properties,
    statements
  }

}


function generateStatements(watch, state, path) {
  const {
    watchName,
    strict
  } = state.opts;

  const statements = [];

  statements.push(
    buildComponentWatchBuilder()
  );

  watch.forEach(({ key, option, handler }) => {

    if ( strict ) {
      if ( !t.isStringLiteral(key) ) {
        throw path.hub.file.buildCodeFrameError(key, 
          `Watch key should be primitive string.`
        );
      }
      if ( !t.isObjectExpression(option) ) {
        throw path.hub.file.buildCodeFrameError(option, 
          `Watch option should be primitive object.`
        );
      }
    }
    statements.push(
      buildComponentWatchOptionBuilder(
        key,
        option,
        t.stringLiteral(handler)
      )
    )

  });

  return statements;
}