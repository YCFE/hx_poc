import webpack from 'webpack';

export default function generateBabelImpl() {
  
  return function babelModifyImpl(babelConfig) {

    console.log('可修改babel配置项', babelConfig);

    return babelConfig;
  }
}