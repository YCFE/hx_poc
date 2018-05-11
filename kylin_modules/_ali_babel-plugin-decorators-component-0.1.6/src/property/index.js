import * as t from 'babel-types';
import template from 'babel-template';
import * as Data from './data';
import * as Other from './other';
import { getObjectProperty, printCodeFrameWarning } from '../utils';
import chalk from 'chalk';

export function processPropertyList(propertyList, state, path) {

  const {
    className,
    propertyName,
    strict,
    noJSX
  } = state.opts;

  const properties = [];
  const propertyKeyMap = {};

  propertyList.forEach((classProperty) => {
    const key = classProperty.key.name;

    switch(key) {
      case 'data':
        {
          const objectPropertyPair = Data.processProperty(classProperty, state);
          if ( objectPropertyPair ) {
            properties.push(objectPropertyPair);
            propertyKeyMap['data'] = true;
          }
        }
        break;
      case 'methods':
      case 'computed':
        {
          // 抛错
          if ( strict ) {
            throw path.hub.file.buildCodeFrameError(classProperty, 
              `ClassProperty "${key}" is deprecated. please use ${ key === 'computed' ? 'getter/setter':'' } ClassMethod instead.`
            );
            break;
          }
        }
      case 'watch':  
        {
          // 抛错
          if ( strict ) {
            throw path.hub.file.buildCodeFrameError(classProperty, 
              `ClassProperty "${key}" is deprecated. please use @Watch Decorator to decorate ClassMethod instead.`
            );
            break;
          }
        }
      
      case 'components':
        {

          if ( key === 'components' ) {
            printCodeFrameWarning(path.hub.file, classProperty, 
              (
                `ClassProperty "${key}" is deprecated. please use <dependency> tag to import component instead.`+
                `\nsee "${ chalk.gray("http://kylin.alipay.net/kylin/framework/component/spec.html#dependency%E6%A0%87%E7%AD%BE") }" for more infomation.\n`
              )
            );
          }

        }
      case 'props':
      case 'filters':
      case 'directives':
      case 'name':
      default:
        {
          if ( key === 'render' ) {
            if ( noJSX ) {
              throw path.hub.file.buildCodeFrameError(classProperty, `JSX render is not supported in Component`)
            }
          }
          const objectPropertyPair = Other.processProperty(classProperty, state);
          if ( objectPropertyPair ) {
            properties.push(objectPropertyPair);
            propertyKeyMap[key] = true;
          }
        }
        break;
    }

  });

  // 如果没有name，那塞进去
  if ( !propertyKeyMap['name'] && t.isIdentifier(path.node.id) ) {
    properties.push(
      getObjectProperty(
        'name',
        t.stringLiteral(path.node.id.name)
      )
    );
  }

  return {
    properties,
    propertyKeyMap
  }
};