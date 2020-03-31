# `@tarojs/runtime`

Taro 运行时。在小程序端连接框架（DSL）渲染机制到小程序渲染机制，连接小程序路由和生命周期到框架对应的生命周期。在 H5/RN 端连接小程序生命周期**规范**到框架生命周期。

## 核心 API

### createReactApp()

暴露给 `@tarojs/taro-loader/app` 调用，在小程序入口文件中调用，创建一个小程序 `App` 构造函数接受的小程序应用规范对象。


### createVueApp()

暴露给 `@tarojs/taro-loader/app` 调用，在小程序入口文件中调用，创建一个小程序 `App` 构造函数接受的小程序应用规范对象。

### createPageConfig()

暴露给 `@tarojs/taro-loader/page` 调用，在小程序页面文件中调用，创建一个小程序 `Page` 构造函数接受的小程序页面规范对象。

### window

在小程序端模仿浏览器的 `window` 实现的对象，在浏览器环境中返回浏览器本身的 `window`。此对象通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) 注入到全局对象以供第三方库调用。

### navigator

在小程序端模仿浏览器的 `navigator` 实现的对象，在浏览器环境中返回浏览器本身的 `navigator`。此对象通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) 注入到全局对象以供第三方库调用。

### document 

在小程序端模仿浏览器的 `document` 实现的对象，在浏览器环境中返回浏览器本身的 `document`。此对象通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) 注入到全局对象以供第三方库调用。

### Current

暴露给开发者的 Taro 全局变量，目前有三个属性：

* `Current.app`，返回当前小程序应用实例，非小程序端返回小程序规范应用实例，可通过此实例调用小程序规范生命周期。
* `Current.page`，返回当前小程序页面实例，非小程序端返回小程序规范页面实例，可通过此实例调用小程序规范生命周期。
* `Current.router`，返回当前小程序路由信息，非小程序端返回小程序规范路由信息

### options

Taro 配置：

* `html`: [渲染 HTML](https://taro-docs.jd.com/taro/next/docs/html.html)
* `debug`: 开启之后会打印渲染时间
* `prerender`: 暴露给 `@tarojs/cli` 的内部参数

### Events

[Taro 消息机制](https://nervjs.github.io/taro/docs/apis/about/events.html#docsNav)。
