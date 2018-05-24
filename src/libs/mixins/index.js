import Vue from 'vue';
import { AlertPlugin } from 'vux';

Vue.use(AlertPlugin);

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
    },
    alert(content) {
      this.$vux.alert.show({
        title: '提示',
        content
      })
    }
  },
  mounted() {
    this.setTitle();
    this.doRemoteLog();
  }
};
