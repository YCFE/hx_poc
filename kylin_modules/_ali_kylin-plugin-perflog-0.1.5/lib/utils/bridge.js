'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readyCall = readyCall;
exports.log = log;
function readyCall() {
  var arg = arguments;
  var bridge = window.AlipayJSBridge;
  var that = this;

  if (bridge && typeof bridge.call === 'function') {
    bridge.call.apply(bridge, arg);
  } else {
    document.addEventListener('AlipayJSBridgeReady', function () {
      bridge = window.AlipayJSBridge;
      bridge.call.apply(bridge, arg);
    });
  }
}

function log(a) {
  if (console) {
    if (typeof console.error === 'function') {
      console.error(a);
    } else if (typeof console.log === 'function') {
      console.log(a);
    }
  }
}
//# sourceMappingURL=bridge.js.map