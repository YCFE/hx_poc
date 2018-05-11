export function setSharedData(opts) {
  const data = opts.data;
  for (const key in data) {
    // var res = {data: data[key]};
    const res = data[key];
    window.localStorage.setItem(key, JSON.stringify(res));
  }
}

export function getSharedData(opts, callback) {
  const keys = opts.keys;

  const results = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const b = window.localStorage.getItem(key);
    results[key] = JSON.parse(b);
  }

  callback && callback({
    data: results,
  });
}

export function removeSharedData(opts) {
  const keys = opts.keys;

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    window.localStorage.removeItem(key);
  }
}
