import template from 'babel-template';
import { ComponentObjectBuilder } from './component-builder';

export default function ({messages, template, types: t}) {

  return {
    inherits: require("babel-plugin-syntax-decorators"),
    pre(file) {

      // 预处理一下 options
      const classDecoratorName = this.opts.className;
      const propertyDecoratorName = this.opts.propertyName;
      const watchName = this.opts.watchName;
      const objectName = this.opts.objectName;
      const strict = this.opts.strict;
      const noJSX = this.opts.noJSX;

      this.opts = {
        className: classDecoratorName || 'Component',
        propertyName: propertyDecoratorName || 'Property',
        objectName: objectName || 'Object',
        watchName: watchName || 'Watch',
        strict: typeof strict === 'undefined' ? false : !!strict,
        noJSX: !!noJSX
      };

    },
    visitor: {
      Program: {
      
      },
      ExportDefaultDeclaration(path){
        // 转发 Export Default ClassDeclaration 到 ClassExpression 中统一处理
        if (!path.get("declaration").isClassDeclaration()) return;

        const {node} = path;
        const ref = node.declaration.id || path.scope.generateUidIdentifier("default");
        node.declaration.id = ref;

        // Split the class declaration and the export into two separate statements.
        path.replaceWith(node.declaration);
        path.insertAfter(t.exportNamedDeclaration(null, [t.exportSpecifier(ref, t.identifier('default'))]));
      },
      ClassDeclaration(path, state) {
        // 转发 ClassDeclaration 到 ClassExpression 中统一处理

        const {node} = path;

        // 新建一个引用, 优先用class的变量名 匿名的话创建一个
        const ref = node.id || path.scope.generateUidIdentifier("class");

        // 把declaration改写成let id = expression
        const letBlock = t.variableDeclaration("let", [
          t.variableDeclarator(ref, t.toExpression(node))
        ]);

        path.replaceWith(letBlock);

      },
      ClassExpression(path, state){

        const {
          className,
          propertyName
        } = state.opts;

        // 1. 检测 class 级别 decorator
        const {node} = path;

        // 2. 如果是null，那是 decorator-legacy 处理完了，return
        //    如果是undefined，那是没有装饰器
        if (node.decorators === undefined || node.decorators === null) {
          return;
        }

        // 开始处理带有 decorator的component
        const decorators = node.decorators;
        if (!Array.isArray(decorators)) {
          throw path.buildCodeFrameError(
            `unsupportet decorators format, should be Array`
          );
        }

        // 提取出decorator的名称数组
        const decoratorNames = decorators.map(decorator => (
          t.isIdentifier(decorator.expression) ? decorator.expression.name : (
            (t.isCallExpression(decorator.expression) && t.isIdentifier(decorator.expression.callee)) ? decorator.expression.callee.name : null
          )
        )).filter(Boolean);

        // 开始匹配条件
        // 如果 装饰器中有 @Component ，并且有其他装饰器，则直接报语法错误
        if ( decoratorNames.filter(d => d===className).length === 1 ) {
          if ( decoratorNames.length === 1 ) {

            // 这里开始处理
            const newBlock = ComponentObjectBuilder(path, state);
            if ( newBlock ) {
              path.replaceWith(newBlock);
            }
            // 在处理各个属性的时候，还要再处理一下

          } else {
            // 如果存在其他 className 的装饰器
            throw path.buildCodeFrameError(
              `@${className} decorator should not be used with other decorators [${decoratorNames.filter(d => d!==className)}]`
            );
          }
        }

      }
    }
  };
}

