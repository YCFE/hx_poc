export function readyCall() {
  let arg = arguments;
  let bridge = window.AlipayJSBridge;
  let that = this;

  if (bridge && typeof bridge.call === 'function') {
    bridge.call.apply(bridge, arg);
  } else {
    document.addEventListener('AlipayJSBridgeReady', function () {
      bridge = window.AlipayJSBridge;
      bridge.call.apply(bridge, arg);
    });
  }
}

export function log(a) {
  if (console) {
    if (typeof console.error === 'function') {
      console.error(a);
    } else if (typeof console.log === 'function') {
      console.log(a);
    }
  }
}
