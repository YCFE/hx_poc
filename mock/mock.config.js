import { Toast } from 'mint-ui';
import 'mint-ui/lib/style.css';

const config = {
  call: {
    rpc(opts, callback) {
      const type = opts.operationType;
      const rpc = require('./rpc/' + type);
      const data = typeof rpc === 'function' ? rpc(opts) : rpc;
      setTimeout(() => {
        callback && callback(data);
      }, 10);
    },
    toast(opts, callback) {
      Toast({
        message: opts.content
      });
    },
    pushWindow(opts) {
      window.location.href = opts.url;
    }
  }
};

window.lunaMockConfig = config;
