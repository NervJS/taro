---
title: React DevTools
---

:::note
Taro v3.3.1 开始支持。
:::

在开发小程序时可以使用 [React DevTools](https://github.com/facebook/react/blob/main/packages/react-devtools/README.md)。

## 使用方法

### 1. 安装

在项目中安装 Taro 插件 `@tarojs/plugin-react-devtools`：

```sh
$ yarn add --dev @tarojs/plugin-react-devtools
```

### 2. 配置 Taro 插件

在 Taro 编译配置中配置使用 `@tarojs/plugin-react-devtools`：

```js title="config/dev.js"
config = {
  plugins: [
    '@tarojs/plugin-react-devtools'
  ],
  // ...
}
```

### 3. 编译项目

```sh
$ taro build --type weapp --watch
```

## 插件参数

插件 `@tarojs/plugin-react-devtools` 具有以下参数：

### enabled

`boolean`

默认值：`true`

控制是否连接 `react-devtools`，开启后会注入 backend 的代码到开发者的应用中。

### port

`number`

默认值：`8097`

React DevTools 使用的 Websocket 端口。

## 注意事项

- 强制锁定了 `react-devtools` 的版本，更新版本需要修改 `@tarojs/plugin-react-devtools` 插件的代码。
- [为了识别 custom hooks](https://github.com/facebook/react/blob/main/packages/react-devtools/OVERVIEW.md#inspecting-hooks)，backend 会对部分符合条件的函数式组件执行 `shallow rendering`，开发者需要注意代码是否存在副作用。

另外，目前对 devtools 功能的支持不够全面，有些功能需要针对小程序环境魔改 backend 才能实现，欢迎共建～

- 支持元素高亮。
- 在小程序的 `storage` 中记录 `filters` 变化。

## 详细设计

详细设计请看 [RFC](https://github.com/NervJS/taro-rfcs/blob/master/rfcs/0005-react-devtools.md)。
