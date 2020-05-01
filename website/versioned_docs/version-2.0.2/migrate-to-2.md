---
title: 迁移至 Taro 2.x
id: version-2.0.2-migrate-to-2
original_id: migrate-to-2
---

Taro 2.0 整体上与 1.0 是完全兼容的，迁移并不困难，本指南将指导你如何进行从 Taro 1.x 到 Taro 2.x 的迁移工作。

## 更新 Taro CLI 和依赖版本

你可以根据自己的实际情况选择升级全局的 Taro 版本或者仅为你的某一个项目升级。

### 全局 CLI 升级

如果你的 Taro CLI 以全局方式安装，并且你希望升级到 Taro 2.0 需要执行以下命令：

```bash
# 使用 Taro 自己

$ taro update self 2.0.0

# 如果你使用 NPM

$ npm update -g @tarojs/cli@2.0.0

# 如果你使用 Yarn

$ yarn global upgrade @tarojs/cli@2.0.0
```

之后在你的项目目录里运行以下命令来升级依赖：

```bash
$ taro update project 2.0.0
```

### 单独为某一个项目升级

这样做的好处是全局的 Taro 版本还是 1.x 的，多个项目间的依赖不冲突，其余项目依然可以用旧版本开发。
如果你的项目里没有安装 Taro CLI，你需要先装一个：

```bash
# 如果你使用 NPM

$ npm install --save-dev @tarojs/cli@2.0.0

# 如果你使用 Yarn

$ yarn add -D @tarojs/cli@2.0.0
```

然后在你的项目目录里运行以下命令来升级依赖：

```bash
# 如果你使用 NPM

$ node ./node_modules/.bin/taro update project 2.0.0

# 如果你使用 Yarn

$ yarn taro update project 2.0.0
```

## 安装 `@tarojs/mini-runner` 依赖

Taro 2.0 新增了 `@tarojs/mini-runner` 作为小程序的编译依赖，所以你需要将它安装在你的项目里，运行：

```bash
# 如果你使用 NPM

$ npm install --save-dev @tarojs/mini-runner@2.0.0

# 如果你使用 Yarn

$ yarn add -D @tarojs/mini-runner@2.0.0
```

## 编译配置调整

Taro 2.0 对 CLI 的编译构建系统进行了重构，使用 Webpack 来实现编译构建，所以我们对部分编译配置做了优化调整。

```js
const config = {
  projectName: 'taro-framework',
  date: '2019-11-2',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  // babel、csso、uglify 等配置从 plugins 配置中移出来
  babel: {
    sourceMap: true,
    presets: [['env', { modules: false }]],,
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread'
    ]
  },
  // 小程序配置从 weapp 改为 mini，可以删掉很多小配置
  mini: {
    webpackChain (chain, webpack) {},
    cssLoaderOption: {},
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      }
    }
  },
  // 可以删掉很多小配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    webpackChain (chain, webpack) {},
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
```

具体编译配置请参考 [编译配置文档](config-detail.md)。

## 异步编程调整

Taro 2.0 中开启 `async functions` 支持不再需要安装 `@tarojs/async-await`，而是直接通过 babel 插件来获得支持。

如果你已经在项目中安装并使用 `@tarojs/async-await` 包，需先将它删除。

```bash
# 如果你使用 NPM

$ npm uninstall @tarojs/async-await

# 如果你使用 Yarn

$ yarn remove @tarojs/async-await
```

在你的 `App.jsx/tsx` 里删除 `import '@tarojs/async-await'`。

```diff
import Taro, { Component } from '@tarojs/taro'
- import '@tarojs/async-await'
import Index from './pages/index'

import './app.scss'

class App extends Component {
```

在项目根目录下安装包 `babel-plugin-transform-runtime` 和 `babel-runtime`。

```bash
# 如果你使用 NPM

$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime

# 如果你使用 Yarn

$ yarn add -D babel-plugin-transform-runtime
$ yarn add babel-runtime
```

随后修改项目 [babel 配置](https://nervjs.github.io/taro/docs/config-detail.html#babel)，配置插件 `babel-plugin-transform-runtime`。

```js
babel: {
  sourceMap: true,
  presets: [['env', { modules: false }]],
  plugins: [
    'transform-decorators-legacy',
    'transform-class-properties',
    'transform-object-rest-spread',
    ['transform-runtime', {
      "helpers": false,
      "polyfill": false,
      "regenerator": true,
      "moduleName": 'babel-runtime'
    }]
  ]
}
```

#### 注意：Taro RN 依赖升级到 0.59.9

在 2.0 中我们将 RN 端 React 依赖升级到 16.8.0，React Native 依赖升级到 0.59.9。主要原因：

- Google 要求所有 [Google Play](https://play.google.com/) 应用支持 64 位 so 库，而现有 RN 0.55.4 依无法支持 64 位库，为配合 64 位升级，Taro RN  端的 React Native 依赖需要同步升级
- React 16.8.0 是第一个支持 Hook 的版本，React Native 从 0.59 版本开始支持 Hook，此前社区一直在呼吁对 RN 0.55.4 进行升级以直接支持 Hook 的写法

本次 RN 端属于无缝升级，原有的写法和配置均不变，如果使用 [taro-native-shell](https://github.com/NervJS/taro-native-shell) 的，选择 0.59.9 分支即可；在原生应用集成 RN 的，需要自行升级 React Native 依赖到 0.59.9。
