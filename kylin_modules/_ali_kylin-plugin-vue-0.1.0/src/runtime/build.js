import webpack from 'webpack';

export default function generateBuildImpl() {
  
  return function webpackModifyImpl(webpackConfig) {

    console.log('可修改webpack配置项', webpackConfig);

    return webpackConfig;
  }
}