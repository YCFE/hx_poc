# @ali/kylin-plugin-perflog

> 插件 - perflog

## 介绍

`@ali/kylin-plugin-perflog`插件

- 在运行时，修改了`option`
    - 动态注入生命周期函数`beforeCreate`, `mounted`, `store.change`
    - 获取页面vue首次渲染完毕，和store变更引起的渲染完毕

## 配置插件

- npm包安装

```shell
tnpm install @ali/kylin-plugin-perflog --save
```

- `package.json`注册插件

```json
{
  "kylinApp": {
    ...
    "plugins": [
      ["perflog", {}]
    ]
    ...
  }
}
```

