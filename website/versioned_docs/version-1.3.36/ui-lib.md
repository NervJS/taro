---
title: 基于 Taro 开发第三方多端 UI 库
id: version-1.3.36-ui-lib
original_id: ui-lib
---

> 通过 Taro 提供的多端 UI 库打包能力，可以打包出一个多端运行的 UI 库，目前已经支持 微信/支付宝/百度小程序以及 H5，RN 端。示例项目 [taro-ui-sample](https://github.com/NervJS/taro-ui-sample)

## 多端 UI 库项目结构

多端 UI 库的项目目录结构与普通 Taro 项目基本一致，不同点如下

#### 增加一个 UI 库入口文件
> RN 端 `index.js` 已经被占用，如果要兼容 RN 端，需改为其他名字，并通过 `--ui-index`指定入口文件。

需要在 `src` 目录下添加 `index.js` 或者 `index.ts` 来作为 UI 库的入口文件，用于输出 UI 组件，如果有多个 UI 组件，可以如下书写

```javascript
export { default as A } from './components/A/A'
export { default as B } from './components/B/B'
```

这样的话，这个组件库使用起来，会是如下的方式

```javascript
import { A } from 'taro-ui-sample'

<A />
```

如果只有 UI 组件，也可以如下书写

```javascript
import A from './components/A/A'

export default A
```

这样的话，这个组件库使用起来，会是如下的方式

```javascript
import A from 'taro-ui-sample'

<A />
```

#### 配置文件改造

为了打包出可以在 H5 端使用的组件库，需要在 `config/index.js` 文件中增加一些配置

```javascript
if (process.env.TARO_BUILD_TYPE === 'ui') {
  Object.assign(config.h5, {
    enableSourceMap: false,
    enableExtract: false,
    enableDll: false
  })
  config.h5.webpackChain = chain => {
    chain.plugins.delete('htmlWebpackPlugin')
    chain.plugins.delete('addAssetHtmlWebpackPlugin')
    chain.merge({
      output: {
        path: path.join(process.cwd(), 'dist', 'h5'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'taro-ui-sample'
      },
      externals: {
        nervjs: 'commonjs2 nervjs',
        classnames: 'commonjs2 classnames',
        '@tarojs/components': 'commonjs2 @tarojs/components',
        '@tarojs/taro-h5': 'commonjs2 @tarojs/taro-h5',
        'weui': 'commonjs2 weui'
      }
    })
  }
}
```

以上配置可以根据需要自行修改。

## 打包命令

在完成以上项目结构改造后，你就可以获得一个 Taro 的多端 UI 库的项目了

这时候你可以通过如下命令来进行打包

```bash
$ TARO_BUILD_TYPE=ui taro build --ui --ui-index=${CUSTOM_ENTRY}
```
只有当 UI 库入口文件非 `index.js` 时，才需要通过 `--ui-index`指定入口文件，其中 `CUSTOM_ENTRY` 为自定义的 UI 库入口文件。 

打包之后的文件在 `dist` 目录下

里面会包含一个 `index.js` 的入口文件，内容如下，需要注意的是，这个内容是 Taro 自动生成的，不可修改

```javascript
if (process.env.TARO_ENV === 'h5') {
  module.exports = require('./h5/index')
  module.exports.default = module.exports
} else {
  module.exports = require('./weapp/index')
  module.exports.default = module.exports
}
```

H5 端以及小程序类（微信/支付宝/百度）的文件分别在 `h5` 和 `weapp` 目录下，通过入口文件就能在不同的端内进行引用

## 项目测试

推荐采用 [Jest](https://jestjs.io/) 进行测试，项目中已经包含了完整的测试配置与范例，可以直接使用，有以下值得注意的地方

#### 使用 babel-jest

转换器使用 `babel-jest`，为了配合 babel 7 进行使用，需要安装

```bash
$ yarn add --dev babel-jest babel-core@^7.0.0-bridge.0 @babel/core
```

其中 `babel-core@^7.0.0-bridge.0` 一定要安装

#### babel.config.js

由于测试使用了 babel 7，为了避免和 Taro 本身使用的 babel 冲突，测试使用的 babel 配置位于 `babel.config.js` 中
