'use strict';

function CleanEmptyChunkPlugin() {};

CleanEmptyChunkPlugin.prototype.apply = function apply(compiler) {
  var yyy = this;
  compiler.plugin('emit', function (compilation, callback) {
    var xxx = this;
    compilation.chunks.forEach(function (chunk) {
      chunk.files.forEach(function (file) {
        delete compilation.assets[file];
      });
    });
    callback();
  });
};

module.exports = CleanEmptyChunkPlugin;