const ready = (callback) => {
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    document.addEventListener('AlipayJSBridgeReady', callback, false);
  }
}

export default (operationType, cb) => {
  ready(() => {
    AlipayJSBridge.call('showLoading', {
      text: '加载中'
    });

    AlipayJSBridge.call('rpc', {
      operationType,
    }, r => {
      AlipayJSBridge.call('hideLoading');
      cb && cb(r);
    });
  });
}
