---
title: 第三方工具
---

## 概述

如何利用好第三方工具提升使用 Taro 的开发体验是很多社区内开发者共有的问题，比方说如何利用 Jest 测试或者使用 StoryBook 编写组件库示例等等，都需要借助 Taro-H5 相关的能力。

## 基础配置

正常使用 Taro 时，cli 会帮助我们完成编译配置并对 ast 做出一定的修改，如果使用第三方工具，那么我们需要对 webpack 和 babel 相关的配置做出一定的修改。

### Webpack

Taro-H5 中使用到的 API 实际上并不在 `@tarojs/taro` 的入口文件之下，如果想要使用需要在 Webpack 中配置解析入口和别名如下:

```js title="webpack.config.js"
module.exports = {
  // ...
  resolve: {
    mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
    alias: {
      ...config.resolve.alias,
      '@tarojs/taro': '@tarojs/taro-h5'
    },
  },
  // ...
}
```

### Babel

Taro-H5 实际并没有在 Taro 对象上挂载所有的 API，这是为了避免不必要的 API 占用包体的大小，那么为了兼容小程序的 API 使用方法就需要对开发者的代码在编译前做出一些调整，在使用第三方工具时，也需要通过引入 `babel-plugin-transform-taroapi` 依赖完成这一操作。

## 示例

### StoryBook

以 `StoryBook: 6.4.13` 为例，在 Taro 中使用需要在 StoryBook 安装完成之后，更新以下配置：

```js title=".storybook/main.js"
// 6.4.13
const path = require('path')

module.exports = {
  // ...
  babel: options => ({
    ...options,
    plugins: [
      ...options.plugins,
      [require('babel-plugin-transform-taroapi').default, {
        apis: require(require.resolve('@tarojs/taro-h5/dist/taroApis', { basedir: path.resolve(__dirname, '..') })),
        packageName: '@tarojs/taro'
      }],
    ]
  }),
  webpackFinal: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
      alias: {
        ...config.resolve.alias,
        '@tarojs/taro': '@tarojs/taro-h5'
      },
    },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        'process.env.TARO_ENV': JSON.stringify('h5'),
        ENABLE_INNER_HTML: JSON.stringify(false),
        ENABLE_ADJACENT_HTML: JSON.stringify(false),
        ENABLE_SIZE_APIS: JSON.stringify(false),
        ENABLE_TEMPLATE_CONTENT: JSON.stringify(false),
        ENABLE_CLONE_NODE: JSON.stringify(false),
        ENABLE_CONTAINS: JSON.stringify(false),
        ENABLE_MUTATION_OBSERVER: JSON.stringify(false),
      }),
    ]
  })
  // ...
}

``
