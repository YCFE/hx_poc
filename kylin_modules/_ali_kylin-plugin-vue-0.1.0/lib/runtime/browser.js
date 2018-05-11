'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadPlugin;

console.log('提前于业务及框架执行');

function loadPlugin(kylinFramework) {
  console.log('框架初始化后，依次加载插件');

  console.log('框架对象', kylinFramework);
}
//# sourceMappingURL=browser.js.map