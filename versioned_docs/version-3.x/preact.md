---
title: PReact
---

:::info
Taro v3.4 开始支持
:::

[PReact](https://preactjs.com) 是一款体积超小的类 React 框架。与 React 接近 **100k** 的体积相比，它的体积只有 **5k** 左右。在小程序严格的体积要求下，使用 PReact 省下的大量空间则显得弥足珍贵。

### 相关资料

- [与 React 的区别](https://preactjs.com/guide/v10/differences-to-react)

## 使用方法

### 安装依赖

```bash
yarn add preact @tarojs/plugin-framework-react
```

### 配置

1. 修改 Taro 编译配置：

```js title="config/index.js" {3}
const config = {
  // ...
  framework: 'preact'
}
```

2. 修改 Babel 配置：

```js title="babel.config.js" {4}
module.exports = {
  presets: [
    ['taro', {
      framework: 'preact'
    }]
  ]
}
```


3. 如果项目使用了 TypeScript，请打开 `skipLibCheck` 配置，以避免和其它 React 生态库配合使用时报类型错误：

```js title="tsconfig.json" {3}
{
  ...
  "skipLibCheck": true,
}
```

## H5

### Fast-Refresh

开发环境下，React 支持使用 [fast refresh](https://github.com/facebook/react/issues/16604#issuecomment-528663101) 实现组件的 **Hot Reload**。而在 PReact 的生态中，可以借助 [Prefresh](https://github.com/preactjs/prefresh/blob/main/README.md) 实现此功能。

Taro 在开发环境下默认开启 Prefresh，如果需要关闭此功能，需要同时修改 Webpack 和 Babel 的配置：

```js title="config/index.js" {5}
const config = {
  // ...
  h5: {
    devServer: {
      hot: false
    }
  }
}
```

```js title="babel.config.js" {5}
module.exports = {
  presets: [
    ['taro', {
      framework: 'preact',
      hot: false
    }]
  ]
}
```
