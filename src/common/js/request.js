export default (operationType, cb) => {
  AlipayJSBridge.call('showLoading', {
    text: '加载中'
  });

  AlipayJSBridge.call('rpc', {
    operationType,
  }, r => {
    AlipayJSBridge.call('hideLoading');
    cb && cb(r);
  });
}
