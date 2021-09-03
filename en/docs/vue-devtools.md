---
title: Vue DevTools
---

:::note Taro v3.3.2 开始支持。

暂不支持 Vue2。 :::

在开发小程序时可以使用 [Vue DevTools](https://devtools.vuejs.org/guide/installation.html)。

## 使用方法

### 1. 安装

在项目中安装 Taro 插件 `@tarojs/plugin-vue-devtools`：

```sh
$ yarn add --dev @tarojs/plugin-vue-devtools
```

### 2. 配置 Taro 插件

在 Taro 编译配置中配置使用 `@tarojs/plugin-vue-devtools`：

```js title="config/dev.js"
config = {
  plugins: [
    '@tarojs/plugin-vue-devtools'
  ],
  // ...
}
```

### 3. 编译项目

```sh
$ taro build --type weapp --watch
```

## 插件参数

插件 `@tarojs/plugin-vue-devtools` 具有以下参数：

### enabled

`boolean`

默认值：`true`

控制是否连接 `vue-devtools`，开启后会注入 backend 的代码到开发者的应用中。

### port

`number`

默认值：`8098`

Vue DevTools 使用的 Websocket 端口。

## 注意事项

- 强制锁定了 `vue-devtools` 的版本，更新版本需要修改 `@tarojs/plugin-vue-devtools` 插件的代码。

另外，目前对 devtools 功能的支持不够全面，有些功能需要针对小程序环境魔改 backend 才能实现，欢迎共建～

- 支持元素高亮。

## 详细设计

详细设计请看 [RFC](https://github.com/NervJS/taro-rfcs/blob/master/rfcs/0006-vue-devtools.md)。
