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
  }
};

window.lunaMockConfig = config;
