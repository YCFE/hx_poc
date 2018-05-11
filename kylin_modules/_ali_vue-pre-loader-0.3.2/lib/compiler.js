'use strict';

const path = require('path');
const loaderUtils = require('loader-utils');
const parse = require('./parser');
const emit = path.resolve('./emit.js');
const LoadModule = require('./load-module');

let fileName;
let resource;
let basePath;

module.exports = {};

module.exports.default = function compile(context, data) {
  const query = loaderUtils.getOptions(context) || {};

  fileName = path.basename(context.resource);
  resource = context.resource;
  basePath = path.relative(query.baseRelativeTo || context.options.context, context.resource);

  const requirements = [];

  if (data.script) {
    requirements.push(LoadModule.init(context, context.resource).select('script').compileScript().emit(`${basePath}__vue_pre_loader_.js`));
  }

  for (const i in data.styles || []) {
    requirements.push(LoadModule.init(context, context.resource).select('styles', i).compileStyle(data.styles[i].lang).emit(`${basePath}__vue_pre_loader_.${i}.css`));
  }

  context.emitFile(basePath, dumpVue(data));

  return requirements.map(requirement => `require(${JSON.stringify(requirement)});`).join('\n');
};

function dumpVue(data) {
  let result = '';
  result += parseTemplate(data.template) + '\n';
  result += (data.styles || []).map(parseStyle).join('\n') + '\n';
  result += parseScript(data.script) + '\n';
  result += (data.customBlocks || []).map(parseOthers).join('') + '\n';
  return result;
}

function parseTemplate(templateData) {
  if (!templateData) {
    return '';
  }
  return `<template>${templateData.content || ''}</template>`;
}

const spKey = ['scoped', 'lang', 'src'];
function parseStyle(styleData, i) {
  if (!styleData) {
    return '';
  }
  let result = '<style';
  if (styleData.scoped) {
    result += ' scoped';
  }
  if (styleData.src) {
    result += ` src="${styleData.src}"`;
  } else {
    result += ` src="${fileName}.${i}.css" generated`;
  }
  for (const key in styleData.attrs) {
    if (spKey.indexOf(key) !== -1) {
      continue;
    }
    result += ` ${key}="${styleData.attrs[key]}"`;
  }
  result += '>';
  result += '</style>';
  return result;
}

function parseScript(scriptData) {
  if (!scriptData) {
    return '';
  }
  let result = '<script';
  for (const key in scriptData.attrs) {
    result += ` ${key}="${scriptData.attrs[key]}"`;
  }
  if (!scriptData.src) {
    result += ` src="${fileName}.js" generated`;
  }
  result += '>';
  result += '</script>';
  return result;
}

function parseOthers(h) {
  return `<${h.type} ${Object.keys(h.attrs).map(key => `${key}="${h.attrs[key]}"`).join(' ')}>${h.content}</${h.type}>`;
}