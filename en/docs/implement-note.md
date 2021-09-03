---
title: Achieve Details
---

This paper describes the partial implementation of Taro and leads developers to understand the specific features of the Taro dependency pack to better understand Taro project.

:::note not to update regularly. :::

## CLI

`@tarojs/cli` is a Taro CLI tool based on the plugin kernel of `@tarojs/service`.

A series of built-in plugins are pre-mounted in the CLI, each command, each compilation platform is a separate Taro plugin.

## Applet

### On compilation

When compiling the applet, the CLI calls `@tarojs/mini-runner` package.`mini-runner` done mainly these things：

1. Responsible to adjust Webpack configuration based on developer's[compiler configuration](./config)
2. Injects custom PostCSS plugin.(e.g. `postcss-pxtransform`)
3. Injects a custom Webpack plugin.
4. Injects custom Webpack Loaders.(Loaders in `@tarojs/taro-loader` packs)
5. Call Webpack to enable compilation.
6. Modify Webpack compilations and adjust the final compilation.

### On Run

为了让 React、Vue 等框架直接运行在小程序端，我们需要在小程序的逻辑层**模拟浏览器环境**，包括实现 DOM、BOM API 等。

`@tarojs/runtime` 是 Taro 的运行时适配器核心，它实现了精简的 DOM、BOM API、事件系统、Web 框架和小程序框架的桥接层等。

> Because ReactDOM is large and contains many compatible code.Taro has implemented a custom renderer instead of ReactDOM.The renderer is in the `@tarojs/act` package.

这时 Web 框架就可以使用 Taro 模拟的 API 渲染出一颗 Taro DOM 树，但是**这一切都运行在小程序的逻辑层**。And a small xml template needs to be written in advance, how can Taro use a static template file to render this dynamic Taro DOM tree?

Taro selected using the applet `<template>` to quote other `<template>` and to render the equivalent of each DOM node of the Taro DOM tree to a sex formature `<template>`.Just serialize the Taro DOM tree for `setData`to trigger the cross-referencing of `<template>` to render the final UI.

> The project's `distant/base.xml` files are the collections of `<template>`.

### Terminal Plugin

Taro Internal Default Support for 6 Applet Platforms, since [Taro v3.1](https://docs.taro.zone/blog/2021-03-10-taro-3-1-lts#1-%E5%BC%80%E6%94%BE%E5%BC%8F%E6%9E%B6%E6%9E%84) supports all Applets in Taro Plugins：

- `@tarojs/plugin-platform-weapp plugin`
- `@tarojs/plugin-plate-alipay`  PayPal Applet Plugin
- `@tarojs/plugin-platform-swan`    Hidden Applet Plugin
- `@tarojs/plugin-platform-tt`  Byte jump applet plugin
- `@tarojs/plugin-platform-qq`  qq applet plugin
- `@tarojs/plugin-platform-jd`  Gingodon Applet Plugin

Terminal platform plugins are specific platforms and inject logic into compilation and running, detailed in [Platform Plugin Summary](./platform-plugin)

## H5

### On compilation

When compiling H5, the CLI calls `@tarojs/webpack-runner` packs.`webpack-runner` mainly done these things：

1. Responsible to adjust Webpack configuration based on developer's[compiler configuration](./config)
2. Injects custom PostCSS plugin.(e.g. `postcss-pxtransform`,`postcss-plugin-constparse`)
3. Injects a custom Webpack plugin.
4. Injects custom Webpack Loaders.(Loaders in `@tarojs/taro-loader` packs)
5. Call Webpack to enable compilation.
6. Modify Webpack compilations and adjust the final compilation.

### Component library

Taro implements a base component library that follows the microcreditworthiness rule at the H5 end.

The Web Component Library will be provided by default using `@tarojs/components`.

Developers can also use[compatible component library](./h5#react-兼容性组件库)when they develop React, and read `@tarojs/components-act` instead of `@tarojs/components`.

### API

Developers refer to Taro objects from `@tarojs/taro` and use the API provided by it.

In H5 environment,`@tarojs/taro` exposes a Taro object to developers from `@tarojs/api` from `@tarojs/taro-h5`.

> Developers will normally call the API in the form of `Taro.xxx`.`babel-plugin-transform-taroapi` Plugins convert this to `import { xxx } from '@tarojs/taro';` make a call to ensure Tree Shining takes effect.

### Route

`@tarojs/router` implements a router library that follows applet specifications.

## Types

Tare's Typs file is in `@tarojs/taro/types`.

Since the applets are up to date with the API, Typings greatly need community help for maintenance.

## Reverse transformation

Invert conversion, the original micromessage applet conversion to Taro, is currently supported for React.

The reverse transformation is divided into two large blocks on compilation and running at `@tarojs/taroiz` and `@tarojs/with-weapp`.
