export default {
  alert(msg) {
    AlipayJSBridge.call('alert', {
      title: '提示',
      message: msg,
      button: '确定'
    });
  }
}
