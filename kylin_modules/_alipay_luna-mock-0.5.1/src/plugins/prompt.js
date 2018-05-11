export function alert(opts, callback) {
  window.alert(opts.message);
  callback && callback();
}

export function confirm(opts, callback) {
  const message = opts.message || opts.title;
  const result = window.confirm(message);
  callback && callback({
    ok: result,
  });
}

export function toast(opts, callback) {
  console.info(opts);
  callback && callback();
}
