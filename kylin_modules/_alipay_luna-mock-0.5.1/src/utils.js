function log(callType, name, opts, callbackOpts) {
  let strOpts = JSON.stringify(opts);
  const maxLength = 500;
  if (strOpts && strOpts.length > maxLength) {
    strOpts = strOpts.slice(0, maxLength);
    strOpts += '...';
  }

  const config = window.lunaMockConfig || {};
  if (config.disableLog) return;

  console.groupCollapsed(`【${callType}】${name}: ${strOpts}`);
  console.info('name:', name);
  console.info('opts:', opts);
  console.info('callback参数:', callbackOpts);
  console.info('callback参数的字符串形式:', JSON.stringify(callbackOpts));
  console.trace();
  console.groupEnd();
}

// 异步log，跟下面一致，免得顺序乱了
export function asyncLog() {
  const args = arguments;

  setTimeout(() => {
    log.apply(this, args);
  });
}

export function callbackWithLog(callType, name, opts, callback) {
  const tid = setTimeout(() => {
    log(`${callType}请求`, name, opts);
  });

  // 假设所有的callback的调用参数都只有一个
  return function _callbackWithLog(result) {
    // 如果本方法没有马上执行，那么自动异步log
    clearTimeout(tid);

    asyncLog(`${callType}返回`, name, opts, result);

    callback && callback.apply(this, arguments);
  };
}

export function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}
