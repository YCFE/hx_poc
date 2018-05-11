import * as t from 'babel-types';
import template from 'babel-template';
import { processPropertyList } from './property';
import { processMethodList } from './method';

const buildComponentObjectBuilder = template(`
  (function ComponentBuilder() {
    const component = $0;

    ;$1;

    return component;
  })
`)

const buildComponentObjectCallerBuilder = template(`
  $0.$1($2)($3)
`)

export function ComponentObjectBuilder(path, state) {

  const {
    className,
    propertyName,
    objectName,
    strict
  } = state.opts;

  const {
    valid,
    list
  } = classPropertyMethodValidCheck(path, path.node.body.body, state);

  if ( valid ) {

    const propertyList = list.filter(d => d.type === 'ClassProperty');
    const methodList = list.filter(d => d.type === 'ClassMethod');

    // 拿到用户直接赋值了哪些key， 并且应该做什么处理
    const {
      properties: objectExpressionArrayProperty,
      propertyKeyMap
    } = processPropertyList(propertyList, state, path);

    // 获取method
    const {
      properties: objectExpressionArrayMethod,
      statements: statementExpressionArray
    } = processMethodList(methodList, state, propertyKeyMap, path);


    const properties = [].concat(objectExpressionArrayProperty).concat(objectExpressionArrayMethod);


    let componentInfo = buildComponentObjectBuilder(
      t.objectExpression(
        properties
      ),
      statementExpressionArray
    );

    // classNode
    const { node } = path;

    // 保证有且只有一个装饰器 @Component 的情况下，考虑替换实现
    // 期望替换成
    /**
     * 
     * Component.Object(connectOption)(objectGenerator);
     * 
     */

    const ComponentDecorator = node.decorators[0];
    let connectArgs = [ t.objectExpression([]) ];

    if ( t.isCallExpression(ComponentDecorator.expression) ) {
      // 带connectOption
      connectArgs = ComponentDecorator.expression.arguments;
    }

    return buildComponentObjectCallerBuilder(
      t.identifier(className),
      t.identifier(objectName),
      connectArgs,
      componentInfo.expression
    )

  }

}

function classPropertyMethodValidCheck(path, list, state) {
  const {
    className,
    propertyName,
    objectName,
    strict
  } = state.opts;

  let ret = true;
  list.forEach((classPropertyOrMethod) => {
    if ( !t.isIdentifier(classPropertyOrMethod.key) ) {
      // TODO 打出警告，非id类，比如字符串计算key，后续babel会翻译报错
      ret = false;
      throw path.hub.file.buildCodeFrameError(classPropertyOrMethod, 
        `[${classPropertyOrMethod.key && (classPropertyOrMethod.key.name || classPropertyOrMethod.key.value)}] non-identifier key is not supported`
      );
    }
    if ( 
      classPropertyOrMethod.static ||
      // support async method
      // classPropertyOrMethod.async ||
      classPropertyOrMethod.generator
    ) {
      // TODO 打出警告，该key会被直接过滤掉
      // debugger
      
      if ( strict ) {
        ret = false;
        const c = classPropertyOrMethod;
        const errorType = c.static ? 'static' : c.async ? 'async' : 'generator';
        throw path.hub.file.buildCodeFrameError(classPropertyOrMethod, 
          `'${ errorType }' ${classPropertyOrMethod.type} [${classPropertyOrMethod.key && (classPropertyOrMethod.key.name || classPropertyOrMethod.key.value)}] is not supported.`
        );
      }

    }
  });

  list = list.filter(d => !d.static && !d.generator && t.isIdentifier(d.key));

  return {
    list,
    valid: ret
  }
}