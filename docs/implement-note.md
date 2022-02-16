---
title: 实现细节
---

本文会介绍 Taro 的部分实现细节，带动开发者了解 Taro 相关依赖包的具体功能，让开发者对更好地了解 Taro 这个项目。

:::note
不定期更新。
:::

## CLI

`@tarojs/cli` 是 Taro CLI 工具，它基于 `@tarojs/service` 包的插件化内核实现。

CLI 里预先挂载了一系列的内置插件，每个命令、每个编译平台都是一个单独的 Taro 插件。

## 小程序

### 编译时

编译小程序时，CLI 会调用 `@tarojs/mini-runner` 包。`mini-runner` 主要做了这些事情：

1. 负责根据开发者的[编译配置](./config)调整 Webpack 配置。
2. 注入自定义的 PostCSS 插件。（如 `postcss-pxtransform`）
3. 注入自定义的 Webpack 插件。
4. 注入自定义的 Webpack Loaders。（Loaders 位于 `@tarojs/taro-loader` 包中）
5. 调用 Webpack 开启编译。
6. 修改 Webpack 的编译产物，调整最终的编译结果。

### 运行时

为了让 React、Vue 等框架直接运行在小程序端，我们需要在小程序的逻辑层**模拟浏览器环境**，包括实现 DOM、BOM API 等。

`@tarojs/runtime` 是 Taro 的运行时适配器核心，它实现了精简的 [DOM、BOM API](taro-dom)、事件系统、Web 框架和小程序框架的桥接层等。

> 因为 ReactDOM 体积较大，且包含很多兼容性代码。因此 Taro 借助 react-reconciler 实现了一个自定义渲染器用于代替 ReactDOM。渲染器位于 `@tarojs/react` 包中。

这时 Web 框架就可以使用 Taro 模拟的 API 渲染出一颗 Taro DOM 树，但是**这一切都运行在小程序的逻辑层**。而小程序的 xml 模板需要提前写死，Taro 如何使用一个静态的模板文件去渲染这颗动态的 Taro DOM 树呢？

Taro 选择了利用小程序 `<template>` 可以引用其它 `<template>` 的特性，把 Taro DOM 树的每个 DOM 节点对应地渲染为一个个 `<template>`。这时只需要把 Taro DOM 树的序列化数据进行 `setData`，就能触发 `<template>` 的相互引用，从而渲染出最终的 UI。

> 项目的 `dist/base.xml` 文件就是这些 `<template>` 的集合。

### 端平台插件

Taro 内部默认支持 6 大小程序平台，自 [Taro v3.1](https://docs.taro.zone/blog/2021-03-10-taro-3-1-lts#1-%E5%BC%80%E6%94%BE%E5%BC%8F%E6%9E%B6%E6%9E%84) 版本之后，对各小程序平台的支持都以 Taro 插件的形式进行：

- `@tarojs/plugin-platform-weapp`	微信小程序插件
- `@tarojs/plugin-platform-alipay`	支付宝小程序插件
- `@tarojs/plugin-platform-swan`	百度小程序插件
- `@tarojs/plugin-platform-tt`	字节跳动小程序插件
- `@tarojs/plugin-platform-qq`	qq 小程序插件
- `@tarojs/plugin-platform-jd`	京东小程序插件

端平台插件针对特定的平台，会分别为编译时和运行时注入逻辑，详情请见 [《端平台插件概述》](./platform-plugin)。

## H5

### 编译时

编译 H5 时，CLI 会调用 `@tarojs/webpack-runner` 包。`webpack-runner` 主要做了这些事情：

1. 负责根据开发者的[编译配置](./config)调整 Webpack 配置。
2. 注入自定义的 PostCSS 插件。（如 `postcss-pxtransform`、`postcss-plugin-constparse`）
3. 注入自定义的 Webpack 插件。
4. 注入自定义的 Webpack Loaders。（Loaders 位于 `@tarojs/taro-loader` 包中）
5. 调用 Webpack 开启编译。
6. 修改 Webpack 的编译产物，调整最终的编译结果。

### 组件库

Taro 在 H5 端实现了遵循微信小程序规范的基础组件库。

默认会使用 `@tarojs/components` 提供的 Web Components 组件库。

开发者使用 React 开发时，也可以选用[兼容性组件库](./h5#react-兼容性组件库)，这时 `@tarojs/components-react` 将会代替 `@tarojs/components`。

### API

开发者从 `@tarojs/taro` 中引用 Taro 对象并使用它提供的 API。

在 H5 环境，`@tarojs/taro` 会从 `@tarojs/api` 取与平台无关的 API，从 `@tarojs/taro-h5` 中取遵循小程序规范实现的 API，最终集合成一个 Taro 对象暴露给开发者。

> 开发者一般会以 `Taro.xxx` 这种形式调用 API。`babel-plugin-transform-taroapi` 插件会把这种写法转换为 `import { xxx } from '@tarojs/taro';` 再进行调用，这样才能保证 Tree Shaking 生效。

### 路由

`@tarojs/router` 实现了遵循小程序规范的路由库。

## Typings

Taro 的 Typings 文件位于 `@tarojs/taro/types` 中。

因为各小程序的 API 更新较快，Typings 十分需要社区协助维护。

## 反向转换

反向转换，即原生微信小程序转换为 Taro 的功能，目前支持转换为 React。

反向转换分为编译时和运行时两大模块，分别位于 `@tarojs/taroize` 和 `@tarojs/with-weapp`。

## 相关阅读

- [如何参与大型开源项目-Taro 共建](https://docs.taro.zone/blog/2022-01-19-how-to-join-Taro.md)
