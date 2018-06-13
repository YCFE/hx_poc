import Vue from 'vue';
import briage from '@/libs/briage';
import { AlertPlugin } from 'vux';

Vue.use(AlertPlugin);

export default {
  methods: {
    doRemoteLog() {
      const { seedId } = this;

      if (!seedId) {
        return;
      }

      briage('remoteLog', {
        seedId
      });
    },
    setTitle() {
      briage('setTitle', {
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
