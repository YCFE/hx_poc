'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('./webpack');

Object.keys(_webpack).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _webpack[key];
    }
  });
});

var _babel = require('./babel');

Object.keys(_babel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _babel[key];
    }
  });
});