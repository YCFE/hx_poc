export default (operationType, cb) => {
  AlipayJSBridge.call('rpc', {
    operationType,
  }, r => {
    cb && cb(r);
  });
}
