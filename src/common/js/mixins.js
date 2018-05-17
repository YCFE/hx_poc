export default [{
  mounted() {
    AlipayJSBridge.call('setTitle', {
      title: document.title
    });
  }
}];
