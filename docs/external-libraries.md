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
const webpack = require('webpack');
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
        '@tarojs/taro': '@tarojs/taro-h5',
        ['@tarojs/components$']: '@tarojs/components/dist-h5/react',
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
```

:::caution 请注意
该方法不适用 `pxTransform` 方法，如果需要使用请先调用自行调用 `initPxTransform` 初始化配置 (目前 Taro 使用 webpack4 构建项目，无法在 StoryBook 中直接引用 `@tarojs/webpack-runner` 提供的方法引入所有配置，等升级到 webpack5 之后会提供替代解决方案)。
目前解决办法是在.storybook/preview.js中预先执行`initPxTransform`并载入相关样式。
:::

```js title=".storybook/preview.js"
import { DecoratorFn } from '@storybook/react';

import { defineCustomElements, applyPolyfills } from '@tarojs/components/loader';
import Taro from '@tarojs/taro';

import '@tarojs/components/dist/taro-components/taro-components.css';

export const decorators = [
  (Story) => {
    applyPolyfills().then(function () {
      defineCustomElements(window);
    });

    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {
        '640': 2.34 / 2,
        '750': 1,
        '828': 1.81 / 2,
      },
    });
    return <Story />;
  },
];

//...
```

### Jest

使用 Jest 测试也是类似，需要添加配置如下

```js title="jest"
module.exports = {
  // ...
  globals: {
    // ...
    window: true,
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
    ENABLE_MUTATION_OBSERVER: true,
  },
  moduleNameMapper: {
    // ...
    '@tarojs/taro': '@tarojs/taro-h5',
    // '@tarojs/components': '@tarojs/components/dist-h5/react',
    // '@tarojs/plugin-framework-react/dist/runtime': '<rootDir>/__mocks__/taro-framework',
    // '@tarojs/plugin-framework-vue2/dist/runtime': '<rootDir>/__mocks__/taro-framework',
    // '@tarojs/plugin-framework-vue3/dist/runtime': '<rootDir>/__mocks__/taro-framework',
  }
}
```

:::caution 请注意
该方法不适用路由跳转和部分生命周期测试。
:::

#### TabBar

如果项目需要测试 TabBar 相关的逻辑，需要将应用完成初始化，参看方法如下：

```js title="__tests__/tab-bar.test.js"
import * as Taro from '@tarojs/taro-h5'
import { buildApp } from './utils'

describe('tabbar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    buildApp()
  })

  it('should be able to set/removeTabBarBadge', done => {
    Taro.eventCenter.once('__taroSetTabBarBadge', res => res.successHandler({
      errMsg: 'setTabBarBadge:ok'
    }))
    Taro.eventCenter.once('__taroRemoveTabBarBadge', res => res.successHandler({
      errMsg: 'removeTabBarBadge:ok'
    }))
    Taro.setTabBarBadge({
      index: 0,
      text: 'text'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarBadge:ok')

      Taro.removeTabBarBadge({
        index: 0
      }).then(res => {
        expect(res.errMsg).toBe('removeTabBarBadge:ok')
        done()
      })
    })
  })
})
```

```js title="__tests__/utils.js"
import { createReactApp } from '@tarojs/plugin-framework-react/dist/runtime'
import { createRouter } from '@tarojs/router'
import React, { Component } from 'react'
import ReactDOM from 'react-test-renderer'

const appConfig: any = {
  pages: [
    'pages/index/index',
    'pages/about/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#333',
    selectedColor: '#409EFF',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [{
      pagePath: '/pages/index/index', text: '首页'
    }, {
      pagePath: '/pages/about/about', text: '关于'
    }],
    mode: 'hash',
    basename: '/test/app',
    customRoutes: {
      '/pages/about/index': '/about'
    }
  },
  router: { mode: 'hash' }
}

export function buildApp () {
  const config: any = { ...appConfig }
  class App extends Component {
    render () {
      return this.props.children
    }
  }
  config.routes = [
    config.pages?.map(path => ({ path, load: () => null }))
  ]
  const inst = createReactApp(App, React, ReactDOM, config)
  createRouter(inst, config, 'React')
}
```

```js title="__mocks__/taro-framework.js"
const App = {}
export function createReactApp () { return { ...App } }
export function createVueApp () { return { ...App } }
export function createVue3App () { return { ...App } }
```

#### Hooks

一些诸如 `useDidShow`、`useDidHide` 等等依赖于生命周期的 Hooks 并不会通过 Taro-H5 提供，使用它们需要提供 Mock 方法并挂在到 taro 对象上（可以参考 `@tarojs/plugin-framework-react/dist/api-loader` 中的方法注入），测试时如果需要触发钩子，则可以通过 `Taro.eventCenter` 来模拟。
