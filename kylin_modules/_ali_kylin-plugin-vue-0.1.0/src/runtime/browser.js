// 需要在这里加载mock
console.log('提前于业务及框架执行')

export default function loadPlugin(kylinFramework) {

  // nothing 不需要做
  console.log('框架初始化后，依次加载插件');
  //
  console.log('框架对象', kylinFramework)
}