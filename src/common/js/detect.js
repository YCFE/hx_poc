const ua = window.navigator.userAgent;

export default {
  isWx() {
    return ua.indexOf('MicroMessenger') > -1;
  },
  isIOS() {
    return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  },
  isAndroid() {
    return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
  }
};
