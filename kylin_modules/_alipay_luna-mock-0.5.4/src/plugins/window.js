export function pushWindow(opts) {
  window.location.href = opts.url;
  console.info(opts.param);
}

export function popTo(opts) {
  window.location.href = opts.urlPattern;
}

export function popWindow() {
  window.history.back();
}
