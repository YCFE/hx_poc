'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hookDevtoolsGlobal = hookDevtoolsGlobal;
var fakeDevtool = exports.fakeDevtool = {
  on: function on() {
    console.warn('devtool on', arguments);
  },
  off: function off() {
    console.warn('devtool off', arguments);
  },
  emit: function emit() {
    console.warn('devtool emit', arguments);
  },
  once: function once() {
    console.warn('devtool once', arguments);
  }
};

function hookDevtoolsGlobal(window) {
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) return false;

  try {
    Object.defineProperty(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
      get: function get() {
        return fakeDevtool;
      }
    });
  } catch (ex) {
    return false;
  }

  return true;
}
//# sourceMappingURL=devtool.js.map