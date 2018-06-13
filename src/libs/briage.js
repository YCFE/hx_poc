const ready = (callback) => {
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    document.addEventListener('AlipayJSBridgeReady', callback, false);
  }
}

export default (...args) => {
  ready(() => {
    AlipayJSBridge.call(...args);
  });
};
