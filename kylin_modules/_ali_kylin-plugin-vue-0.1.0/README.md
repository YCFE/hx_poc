# @ali/kylin-plugin-vue

> 插件 - vue

## 介绍

`@ali/kylin-plugin-vue`插件

- 配置`vue`特定版本的编译环境和运行时特定依赖

|npm版本|vue版本|
|-----|-----|
|`^0.1.0`|`2.1.6`|
|`^0.4.0`|`2.4.2`|

## 配置插件

- npm包安装

```shell
tnpm install @ali/kylin-plugin-vue --save
```

- `package.json`注册插件

```json
{
  "kylinApp": {
    ...
    "plugins": [
      ["vue", {}]
    ]
    ...
  }
}
```

