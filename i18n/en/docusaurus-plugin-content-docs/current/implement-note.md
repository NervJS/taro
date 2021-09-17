---
title: Implementation Details
---

This article will introduce some of the implementation details of Taro, drive developers to understand the specific functions of Taro related dependency packages, and give developers a better understanding of the Taro project.

:::note
Occasional updates.
:::

## CLI

`@tarojs/cli` is the Taro CLI tool, which is based on the plug-in kernel implementation of the `@tarojs/service` package.

The CLI is pre-mounted with a set of built-in plugins, each command and each build platform is a separate Taro plugin.

## Mini Program

### Compile time

When compiling mini program, the CLI calls the `@tarojs/mini-runner` package. The `mini-runner` mainly does these things.

1. It is responsible for adapting Webpack to the developer's [build configuration](./config) to adjust the Webpack configuration. 2.
2. Injects custom PostCSS plugins. (e.g. `postcss-pxtransform`)
3. Inject custom Webpack plugins. 4.
4. Inject custom Webpack Loaders. (Loaders are located in the `@tarojs/taro-loader` package)
5. Call Webpack to start the build.
6. Modify the Webpack build product to adjust the final build result.

## Runtime

In order for frameworks like React, Vue, etc. to run directly on the mini program side, we need to **emulate the browser environment** in the logic layer of the mini program, including implementing the DOM, BOM API, etc.

`@tarojs/runtime` is the core of Taro's runtime adapter, which implements a streamlined DOM, BOM API, event system, bridge layer for web framework and mini program framework, etc.

> The ReactDOM is large and contains a lot of compatibility code. So Taro has implemented a custom renderer instead of ReactDOM with react-reconciler, which is located in the `@tarojs/react` package.

At this point the web framework can render a Taro DOM tree using the Taro mockup API, but **this all runs at the logic level of the mini program**. How does Taro use a static template file to render a dynamic Taro DOM tree when the mini program xml template needs to be written dead ahead of time?

Taro chose to take advantage of the fact that mini program `<template>`s can reference other `<templates>` by rendering each DOM node of the Taro DOM tree as a `<template>`. This is done by simply `setData`ing the serialized data of the Taro DOM tree, which triggers the cross-referencing of `<template>` and renders the final UI.

> The project's `dist/base.xml` file is a collection of these `<templates>`.

### Platfrom Plugin

Taro internally supports 6 mini program platforms by default, since [Taro v3.1](https://docs.taro.zone/blog/2021-03-10-taro-3-1-lts#1-%E5%BC%80%E6%94%BE%E5%BC%8F%E6%9E%B6%E6%9E%84) support for each mini program platform is available as a Taro plugin.

- `@tarojs/plugin-platform-weapp`	Wechat mini program  plugin
- `@tarojs/plugin-platform-alipay`	Alipay mini program  plugin
- `@tarojs/plugin-platform-swan`	Baidu smart program  plugin 
- `@tarojs/plugin-platform-tt`	ByteDance mini program plugin
- `@tarojs/plugin-platform-qq`	QQ mini program  plugin
- `@tarojs/plugin-platform-jd`	Jingdong mini program  plugin

Platform plugins are platform specific and inject logic for compile-time and run-time respectively, see [Platform Plug-ins Overview](./platform-plugin) for details。

## H5

### Compile time

When compiling H5, the CLI calls the `@tarojs/webpack-runner` package. The `webpack-runner` does these main things.

1. It is responsible for adjusting the Webpack configuration based on the developer's [compile configuration](./config) to adjust the Webpack configuration.
2. Injects custom PostCSS plugins. (e.g. `postcss-pxtransform`, `postcss-plugin-constparse`)
3. Inject custom Webpack plugins.
4. Inject custom Webpack Loaders. (Loaders are located in the `@tarojs/taro-loader` package)
5. Call Webpack to start the build.
6. Modify the Webpack build product to adjust the final build result.

### Component Library

Taro implements a base component library on the H5 side that follows the WeChat mini program specification.

By default, the Web Components component library provided by `@tarojs/components` is used.

When developing with React, developers can also use the [compatibility component library](./h5#react-compatible-components-library), where `@tarojs/components-react` will replace `@tarojs/components`.

### API

Developers refer to the Taro object from `@tarojs/taro` and use the API it provides.

In H5 environments, `@tarojs/taro` takes platform-independent APIs from `@tarojs/api` and APIs that follow the mini program specification from `@tarojs/taro-h5`, and finally aggregates them into a Taro object to expose to developers.

> Developers typically call the API as `Taro.xxx`. The `babel-plugin-transform-taroapi` plugin converts this to `import { xxx } from '@tarojs/taro';` and then calls it again to ensure that Tree Shaking takes effect.

### Router

`@tarojs/router` Implemented a routing library that follows the mini program specification.

## Typings

Taro's Typings file is located in `@tarojs/taro/types`.

Because the APIs for the various mini program are updated quickly, Typings are very much in need of community help to maintain them.

## Reverse conversion

Reverse conversion, native WeChat mini program conversion to Taro, currently supports conversion to React.

Reverse conversion is divided into two modules, compile-time and runtime, located in `@tarojs/taroize` and `@tarojs/with-weapp` respectively.
