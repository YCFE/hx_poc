let mockTitleBar;

export function createTitleBar(opts) {
  if (mockTitleBar) return;

  let title = opts.title;
  if (!title) {
    let icon = opts.icon;
    if (icon) {
      if (!/\.(png|jpg|jpeg)$/.test(icon)) {
        icon = `data:image/png;base64,${icon}`;
      }
      title = `<img src="${icon}">`;
    } else {
      title = opts.icontype;
    }
  }

  const btn = document.createElement('div');
  btn.innerHTML = title;
  btn.style.cssText = 'position:absolute;top:0;right:10px;';

  // 0才显示红点
  if (opts.redDot === '0') {
    btn.insertAdjacentHTML('beforeend', '<span style="display:inline-block; position:absolute; top:3px; right:1px; width:5px; height:5px; border-radius:5px; background:red;"/>');
  }

  btn.onclick = () => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('optionMenu', false, false);
    document.dispatchEvent(event);
  };

  const titleBar = document.createElement('div');
  titleBar.style.cssText = 'position:fixed; top:0; width:100%; z-index:999999;';
  titleBar.appendChild(btn);

  mockTitleBar = titleBar;

  document.body.appendChild(titleBar);
}

export function removeTitleBar() {
  if (mockTitleBar) {
    mockTitleBar.parentNode.removeChild(mockTitleBar);
    mockTitleBar = null;
  }
}
