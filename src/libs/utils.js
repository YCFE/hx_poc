export const getParam = (name, url) => {
  if (!url) {
    url = window.location;
  }

  const params = url.search.substr(1);
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = params.match(reg);

  if (r !== null) {
    return decodeURIComponent(r[2]);
  }

  return null;
}
