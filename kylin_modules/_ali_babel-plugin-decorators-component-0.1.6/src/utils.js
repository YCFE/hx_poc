import * as t from 'babel-types';
import template from 'babel-template';
import codeFrame from 'babel-code-frame';
import chalk from 'chalk';

export function validPropertyDecoratorLength(decorators, state) {
  const {
    className,
    propertyName
  } = state.opts;

  return decorators.filter(d => (
    (
      t.isMemberExpression(d.expression)
      && d.expression.object.name === className 
      && d.expression.property.name === propertyName 
    ) || (
      t.isIdentifier(d.expression)
      && d.expression.name === propertyName
    )
  )).length;
}

const buildComponentPropertyKeyValueBuilder = template(`
  ({
    $0: $1
  })
`);

export function getObjectProperty(keyStr, val) {
  return buildComponentPropertyKeyValueBuilder(
    t.identifier(keyStr),
    val
  ).expression.properties[0];
};


export function printCodeFrameWarning(file, node, message) {
  
  try {
    const loc = node.loc.start;
    const code = file.code;
    const filename = file.opts.filename;

    const codeFrameMessage = codeFrame(code, loc.line, loc.column + 1, {
      highlightCode: false,
      forceColor: false
    });

    console.error(
      `\n${ chalk.yellow("[Deprecated]") } ${filename}:${loc.line}\n` +
      `${message}\n` + 
      `${ codeFrameMessage }`
    );
  } catch(ex) {
    
  }

}