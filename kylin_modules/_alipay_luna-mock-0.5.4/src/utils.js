const isArray = Array.isArray || function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function deepCopy(destination, source) {
  for (const key in source) {
    let value = source[key];

    if (isArray(value)) {
      value = deepCopy([], value);
    } else if (isObject(value)) {
      value = deepCopy({}, value);
    }

    destination[key] = value;
  }

  return destination;
}

function log(callType, name, opts, callbackOpts) {
  // debugconsole是容器自动发出的，会导致循环调用
  if (name === 'debugconsole') return;

  const config = window.lunaMockConfig || {};
  if (config.disableLog) return;

  let strOpts = JSON.stringify(opts);
  const maxLength = 500;
  if (strOpts && strOpts.length > maxLength) {
    strOpts = strOpts.slice(0, maxLength);
    strOpts += '...';
  }

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

    // 防止业务代码中修改了 mock 的返回值，从而污染到 log
    const newResult = deepCopy({}, result);

    asyncLog(`${callType}返回`, name, opts, newResult);

    callback && callback.apply(this, arguments);
  };
}

export function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}
