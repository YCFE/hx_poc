export default {
  methods: {
    doRemoteLog() {
      const { seedId } = this;

      if (!seedId) {
        return;
      }

      AlipayJSBridge.call('remoteLog', {
        seedId
      });
    },
    setTitle() {
      AlipayJSBridge.call('setTitle', {
        title: document.title
      });
    }
  },
  mounted() {
    this.setTitle();
    this.doRemoteLog();
  }
}
