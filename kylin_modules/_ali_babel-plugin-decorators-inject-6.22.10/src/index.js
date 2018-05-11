import template from 'babel-template';

const buildLazyRequire = template(`
  function lazyRequire(resolve) {
    resolve(require($0).default || require($0));
  }
`);

export default function ({messages, template, types: t}) {

  const ReassignmentVisitor = {
    ReferencedIdentifier(path, state) {
      const { imports, refIds, scope } = state;

      const { node } = path;
      const name = node.name;
      const remap = imports[name];
      if (!remap) return;
      if (scope.getBinding(name) !== path.scope.getBinding(name)) return;

      refIds[name] = refIds[name] ||  {};

      if ( node.__lazy_identifier__ ) {
        refIds[name].lazy = refIds[name].lazy || 0;
        refIds[name].lazy ++;
      }
      else {
        refIds[name].ref = refIds[name].ref || 0;
        refIds[name].ref ++;
      }

    },
    AssignmentExpression(path, state) {
      // TODO
    },
    UpdateExpression(path, state) {
      // TODO
    }
  };

  const ComponentPropertyVisitor = {
    ObjectExpression(path, state) {
      const { refIds } = state;
      const { node } = path;

      if ( node.__should_lazyrequire__ ) {

        const lazyMap = state.imports;

        // 遍历properties， 如果满足是import中的，用模板替换 require default, 然后移除 import
        node.properties.forEach((property, index) => {

          // 只处理 object k=>v 中 v是标识符 的场景
          if ( !t.isIdentifier(property.value) ) return;

          const userIdentifier = property.value;
          const name = userIdentifier.name;
          // 这个identifier 连名称都不在import中
          if ( !lazyMap[name] ) return;

          const importData = lazyMap[name];

          // console.log('found ', name)

          // 判断作用于，是否是用一个 identifier引用
          if (importData.scope.getBinding(name) !== path.scope.getBinding(name)) return;

          // 判断是否需要 lazy， 如果别处 refIds 也引用了，那就不处理
          if ( refIds[name] ) {
            if ( refIds[name].ref ) return
          }

          const lazyExpression = buildLazyRequire(
            t.stringLiteral(importData.sourceValue)
          );

          property.value = lazyExpression;

          // 如果已经被别的require加载处理了 那就不再次移除
          if ( importData.path.removed ) return;
          importData.path.remove();

          // console.log('match ', name)

        });
      }

    }
  };

  function onlyHaveDefaultSpecifier(specifiers) {
    if (!specifiers) return false;
    if (specifiers.length !== 1) return false;

    return t.isImportDefaultSpecifier(specifiers[0]);
  }

  function isSourcePath(source) {
    if (!source) return false;
    return t.isStringLiteral(source);
  }

  function hasInjectManual(decorator, path, state) {

    const {
      className,
      propertyName,
      propertyIgnoreName
    } = state.opts;

    const ret = (

      // Identifier, 变量名为propertyIgnoreName
      (decorator.expression.name === propertyIgnoreName) ||

      // MemberExpression, 变量名为 className.propertyName
      ( t.isMemberExpression(decorator.expression) &&
        decorator.expression.object.name === className &&
        decorator.expression.property.name === propertyName
      )

    );
    return ret;

  }

  function injectComponentName(path, state) {

    const {
      injectComponentName
    } = state.opts;

    // 关闭
    if ( !injectComponentName ) return;

    const list = path.node.body.body;
    const classExp = path.node;
    let hasNameProperty = false;
    let hasNonKeyItem = false;
    let hasNameMethod = false;

    const className = classExp.id && classExp.id.name;

    // 如果这个class本身没名字...
    if ( !className ) return;

    list.forEach(function (propertyOrMethod) {
      

      if ( !t.isIdentifier(propertyOrMethod.key) || hasNonKeyItem ) {
        hasNonKeyItem = true;
        // 如果遇到非key的item，表示有计算属性，理论上，过不了babel处理
        // 在此不做注入，以免造成重复属性处理异常
        return;
      }
      // 如果是 ClassProperty
      if ( t.isClassProperty(propertyOrMethod) ) {
        // 只需要检测key的名字是不是name
        if ( propertyOrMethod.key.name === 'name' ) {
          hasNameProperty = true;
        }
      } else if ( t.isClassMethod(propertyOrMethod) ) {
        // 如果有重名name的方法了，就不注入
        if ( propertyOrMethod.key.name === 'name' ) {
          hasNameMethod = true;
        }
      }

    });

    if ( !hasNameMethod && !hasNameProperty ) {
      // 把当前class的name塞进去
      //list.unshift(
      const newProperty = t.ClassProperty(
          t.Identifier("name"),
          t.StringLiteral(className),
          undefined,
          [],
          false
        );
      newProperty.static = false;  
      list.unshift(newProperty);
      //);
    }

  }

  function componentLazyRequireRecognize(path, state) {

    const list = path.node.body.body;

    const {
      componentsPropertyName,
      enableComponentLazyRequire
    } = state.opts;

    if (!enableComponentLazyRequire) return;

    list.forEach(function (propertyOrMethod) {

      // 需要时 class 成员变量
      if (!t.isClassProperty(propertyOrMethod) || propertyOrMethod.static) return;

      // 如果是计算属性，不考虑，是字符常量标识符,
      if ( !t.isIdentifier( propertyOrMethod.key ) ) return;

      // 属性名为 components
      if ( propertyOrMethod.key.name !== componentsPropertyName ) return;

      // 必须是 object 作为right
      if ( !t.isObjectExpression(propertyOrMethod.value) ) return;

      propertyOrMethod.value.__should_lazyrequire__ = true;
      // 标记其中所有 值为identifier的node
      propertyOrMethod.value.properties.forEach((property, index) => {

        // 只处理 object k=>v 中 v是标识符 的场景
        if ( !t.isIdentifier(property.value) ) return;

        property.value.__lazy_identifier__ = true;

      });

    })

  }

  function prependTargetDecorator(path, state) {

    const list = path.node.body.body;

    const {
      className,
      propertyName,
      propertyIgnoreName
    } = state.opts;

    list.forEach(function (propertyOrMtehod) {
      // 如果不是 classProperty 不处理
      
      if (!t.isClassProperty(propertyOrMtehod)) return;

      // 6. 如果 decorator 是 null, 那是 decorator-legacy 处理过了 continue
      if (propertyOrMtehod.decorators === null) return;

      // 如果 decorator 是 undefined，那是没有装饰器， 处理为空数组
      propertyOrMtehod.decorators = propertyOrMtehod.decorators || [];

      //console.log('propertyOrMtehod.decorators', propertyOrMtehod.decorators)

      // 7. 寻找原本已经被手工注入过的，不需要自动注入的装饰器列表
      const matchDecorators = propertyOrMtehod.decorators.filter(decorator => hasInjectManual(decorator, path, state));

      if (matchDecorators.length > 0) return

      // 8. 没有匹配的话，注入 Component.Property
      const insertDecorator = t.Decorator(
        t.MemberExpression(
          t.Identifier(`${className}`),
          t.Identifier(`${propertyName}`)
        )
      );

      propertyOrMtehod.decorators.unshift(insertDecorator)

    });

  }

  function injectRenderParameterH(path, state) {

    const {
      enableRenderInjectH
    } = state.opts;

    if ( !enableRenderInjectH ) return;

    const list = path.node.body.body;

    list.forEach(function (propertyOrMtehod) {

      // 如果不是 classMethod 不处理
      if (!t.isClassMethod(propertyOrMtehod)) return;

      // key必须是 名为`render`的identifier
      if ( !t.isIdentifier(propertyOrMtehod.key) || propertyOrMtehod.key.name !=='render' ) return;

      propertyOrMtehod.__should_inject_create_element__ = true;

    });

    path.traverse({
      ClassMethod(path, state) {

        const { node } = path;

        // 必须是之前被标记过需要处理的
        if ( node.__should_inject_create_element__ !== true ) return;

        // 如果该作用于下已经有了 h 的变量,那就什么都不处理
        if ( path.scope.getOwnBinding('h') ) return

        // 看下param表，如果有入参就不处理了
        if ( node.params && node.params.length > 0 ) return;

        node.params = node.params || [];

        node.params.push(t.Identifier('h'));
      }
    }, {

    });
  }

  return {
    inherits: require("babel-plugin-syntax-decorators"),
    pre(file) {

      // 预处理一下 options
      const classDecoratorName = this.opts.className;
      const propertyDecoratorName = this.opts.propertyName;
      const ignorePropertyDecoratorName = this.opts.propertyIgnoreName;
      const componentsPropertyName = this.opts.componentsPropertyName;
      const enableComponentLazyRequire = this.opts.enableComponentLazyRequire;
      const enableRenderInjectH = this.opts.enableRenderInjectH;
      const injectComponentName = this.opts.injectComponentName;

      this.opts = {
        className: classDecoratorName || 'Component',
        propertyName: propertyDecoratorName || 'Property',
        propertyIgnoreName: ignorePropertyDecoratorName || propertyDecoratorName || 'Property',
        componentsPropertyName: componentsPropertyName || 'components',
        enableComponentLazyRequire: enableComponentLazyRequire === undefined ? false : enableComponentLazyRequire,
        enableRenderInjectH: enableRenderInjectH === undefined ? false : enableRenderInjectH,
        injectComponentName: injectComponentName === undefined ? false : injectComponentName
      };

    },

    visitor: {
      Program: {
        exit(path, state) {
          // 因为 import 存在变量提升
          // 1. 先扫描所有 imports , 必须提前于 transform-es2015-modules-commonjs 这个插件进行
          // 2. 再重新遍历 所有 ObjectExpression 对象，进行按需替换

          const body= path.get("body");
          const imports = Object.create(null);

          for (const path of body) {

            if ( path.isImportDeclaration() ) {

              const { node } = path;
              const { specifiers, source } = node;

              // 只有一个default的输出
              if ( onlyHaveDefaultSpecifier(specifiers) && isSourcePath(source) ) {

                const specifier = specifiers[0];
                const importIdentifier = specifier.local;

                // import local 非标识符
                if ( !t.isIdentifier(importIdentifier) ) return;

                const identifierName = importIdentifier.name;
                const sourceValue = source.value;
                // 把 标识符 和 source 记录到全局map中

                imports[identifierName] = {
                  sourceValue: sourceValue,
                  path: path,
                  scope: path.scope,
                  processed: false
                };

              }

            }

          }

          // 再遍历所有对其变量的引用, 并记录下来
          const refIds = {};
          path.traverse(ReassignmentVisitor, {
            imports,
            refIds,
            scope: path.scope
          });

          path.traverse(ComponentPropertyVisitor, {
            imports,
            refIds
          });

        }
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

        // 标记已完成， 防止decorator-legacy 的多次重复处理
        if (path.node._add_decorator_ === true) return;
        path.node._add_decorator_ = true;

        // 2. 如果是null，那是 decorator-legacy 处理完了，return
        //    如果是undefined，那是没有装饰器
        if (node.decorators === undefined || node.decorators === null) {
          return;
        }

        // 3. 那么是一个数组，筛选其中名叫 configClassDecoratorName 的
        const decorators = node.decorators;
        if (!Array.isArray(decorators)) {
          throw path.buildCodeFrameError(
            `unsupportet decorators format, should be Array`
          );
        }

        //  这一块可能有 函数导致判别问题
        const matchDecorators = decorators.filter(decorator => (
          ( t.isIdentifier(decorator.expression) && decorator.expression.name === className) || 
          ( t.isCallExpression(decorator.expression) && t.isIdentifier(decorator.expression.callee) && decorator.expression.callee.name === className )
           ));

        // 4. 如果只有1个符合条件，才进入@Component处理逻辑
        if (matchDecorators.length === 1) {


          // 4.5. 默认加入name, 在自动添加@Property之前
          injectComponentName(path, state);

          // 5. 如果有，遍历所有 property 和 method
          prependTargetDecorator(path, state);

          // 6. 标记需要进行延迟加载的对象
          componentLazyRequireRecognize(path, state);

          // 7. 对于render方法，预处理入参数据
          // injectRenderParameterH(path, state);

          
        }

      }
    }
  };
}

