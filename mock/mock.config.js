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
    pushWindow(opts) {
      let params = opts.param;
      let query = '';
      if (params) {
        query = '?';
        const arr = Object.keys(params);
        const arr2 = arr.map(el => {
          const str = `${el}=${params[el]}`;
          return str;
        });

        query += arr2.join('&');
      }
      window.location.href = opts.url + query;
    }
  }
};

window.lunaMockConfig = config;
