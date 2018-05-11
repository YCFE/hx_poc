var path = require('path');

function camel2Dash(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1);
  return str.replace(/([A-Z])/g, function camel2DashReplace($1) {
    return '-' + $1.toLowerCase();
  });
}

function camel2Underline(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1);
  return str.replace(/([A-Z])/g, function ($1) {
    return '_' + $1.toLowerCase();
  });
}

function winPath(path) {
  return path.replace(/\\/g, '/');
}

function hasOwn(obj, key) {
  return Object.hasOwnProperty.call(obj,key);
}

function parseTrue(obj, key) {
  return obj[key] === '' || obj[key] === 'true';
}

module.exports = function plugin(block) {

  if ( !/^[a-zA-Z@]/.test(block.src) ) {
    throw new TypeError('component split mode only accept modulesName start with /^[a-zA-Z@]/, but got "' + block.src + '"');
  }

  var attrs = block.attrs;

  var libraryDirectory = hasOwn(attrs, 'libraryDirectory') ? attrs.libraryDirectory : 'lib';
  var camel2DashComponentName = attrs.camel2DashComponentName !== 'false';
  var camel2UnderlineComponentName = parseTrue(attrs, 'camel2UnderlineComponentName');
  var style = parseTrue(attrs, 'style')? true : (
      hasOwn(attrs, 'style') ? attrs.style : false
    );

  function importMethod(methodName) {
    var transformedMethodName = camel2UnderlineComponentName
      ? camel2Underline(methodName)
      : camel2DashComponentName
        ? camel2Dash(methodName)
        : methodName;

    var _path = winPath(path.join(block.src, libraryDirectory, transformedMethodName));
    return _path;
  }

  var newPath = importMethod(block.importName);

  var ret = {
    identifier: block.identifier,
    importName: 'default',
    attrs: block.attrs,
    src: newPath
  };
  var retStyle = null;

  if ( style === true ) {
    retStyle = {
      src: newPath + '/style'
    };
  }
  else if ( style === 'css' ) {
    retStyle = {
      src: newPath + '/style/css'
    };
  }

  return {
    js: ret,
    style: retStyle
  }
}

