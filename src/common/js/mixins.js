export default [{
  mounted() {
    AlipayJSBridge.call('setNavigationBar', {
      title: document.title
    });
  }
}];
