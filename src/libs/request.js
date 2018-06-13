import briage from '@/libs/briage';

export default (operationType, cb) => {
  briage('showLoading', {
    text: '加载中'
  });

  briage('rpc', {
    operationType,
  }, r => {
    briage('hideLoading');
    cb && cb(r);
  });
}
