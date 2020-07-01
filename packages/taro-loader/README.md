# `@tarojs/taro-loader`

暴露给 `@tarojs/mini-runner` 和 `@tarojs/webpack-runner` 使用的 Webpack loader，包含以下 `loader`:

## app

小程序专用。在小程序入口文件调用 `@tarojs/runtime` 的 `createReactApp`/`createVueApp` 方法创建一个小程序 `App` 构造函数接受的对象。

### options: 
* `framework`: 框架类型，`'react' | 'nerv' | 'vue' | 'vue3'`
* `prerender`: [预渲染配置](https://taro-docs.jd.com/taro/next/docs/prerender.html)

## page

小程序专用。在小程序页面文件调用 `@tarojs/runtime` 的 `createPageConfig` 方法创建一个小程序 `Page` 构造函数接受的对象。
### options: 
* `framework`: 框架类型，`'react' | 'nerv' | 'vue' | 'vue3'`
* `name`: 页面路径

## page

小程序专用。在小程序页面文件调用 `@tarojs/runtime` 的 `createComponentConfig` 方法创建一个小程序 `Component` 构造函数接受的对象。

### options: 
* `framework`: 框架类型，`'react' | 'nerv' | 'vue' | 'vue3'`
* `name`: 页面路径

## h5

H5 专用。在小程序入口文件调用 `@tarojs/router` 的 `createRouter` 方法创建兼容小程序生命周期和路由系统的应用。

### options: 
* `framework`: 框架类型，`'react' | 'nerv' | 'vue' | 'vue3'`
* `config`: 应用配置，对应 app.config.js
* `pages：页面配置，对应` page.config.js
* `filename`: 文件名
