export function setAPDataStorage(opts, callback) {
  window.localStorage.setItem(opts.key, opts.value);

  callback({
    error: 0,
  });
}

export function getAPDataStorage(opts, callback) {
  const value = window.localStorage.getItem(opts.key);

  setTimeout(() => {
    callback({
      error: 0,
      data: value,
    });
  }, 0);
}

export function removeAPDataStorage(opts, callback) {
  window.localStorage.removeItem(opts.key);

  callback({
    error: 0,
  });
}
