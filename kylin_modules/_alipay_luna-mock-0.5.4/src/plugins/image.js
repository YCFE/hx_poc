/**
 * 得到 base64，目前只支持图片 url，不支持 djangoId
 * 注：只能是对允许跨域的文件
 * @param {string} url
 * @param {function(string)} cbk
 */
function getBase64ByUrl(url, cbk) {
  const xhr = new window.XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = () => {
    const reader = new window.FileReader();
    reader.onloadend = () => {
      const base64Str = reader.result.replace(/data:(.+)?;base64,/, '');
      cbk && cbk(base64Str);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.onerror = () => {
    cbk && cbk('');
  };
  xhr.open('GET', url);
  xhr.send();
}

const defaultImg = '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';
/**
 * 下载一个图片，获取 base 64 编码
 * @param {object} opts {multimediaID, width, height, match}
 * @param {function()} callback
 */
export function downloadImage(opts, callback) {
  if (/http(s)?:\/\//.test(opts.multimediaID)) { // 如果是链接直接返回链接
    const url = opts.multimediaID;
    getBase64ByUrl(url, (imgData) => {
      const _imgData = imgData || defaultImg;
      callback && callback({ data: _imgData });
    });
  } else { // 否则返回默认图
    callback && callback({ data: defaultImg });
  }
}
