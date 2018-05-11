var resolve = require('resolve');

var modulePath = (function () {

  var moduleName = 'vue-template-compiler';
  var dir = process.cwd();

  try {
    return resolve.sync(moduleName, { basedir: dir }); 
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") throw e;

    try {
      return require.resolve(moduleName);
    } catch (e) {
      throw e;
    }
  }

})();

module.exports = require(modulePath);