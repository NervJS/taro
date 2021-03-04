---
title: 原生项目使用 Taro
---

`3.0.25` 后开始支持在原生项目中部分使用 Taro 进行开发。

#### 示例项目：

[taro-blended](https://github.com/NervJS/taro-blended)

## 基础混合用法

### App 入口

#### 1. 以混合模式进行打包

编译项目时使用 `--blended` 参数以输出混合模式的代码。

```bash
taro build --type weapp --blended
taro build --type weapp --watch --blended
```

#### 2. 移动 Taro 项目的输出目录到原生项目内

可以编写一个** Taro 插件**自动移动，可以参考 [plugin-mv](https://github.com/NervJS/taro-blended/blob/master/taro-project/plugin-mv/index.js)。

#### 3. 原生项目的 app.js 中引用 Taro 入口文件

```js title="app.config.js"
// 必须引用 Taro 项目的入口文件
const taroApp = require('./taro/app.js').taroApp

App({
  onShow () {
    // 可选，调用 Taro 项目 app 的 onShow 生命周期
    taroApp.onShow()
  },

  onHide () {
    // 可选，调用 Taro 项目 app 的 onHide 生命周期
    taroApp.onHide()
  }
})
```

### 引用原生项目的 JS 文件

有时我们需要在 Taro 项目中引用原生项目中的公共 js 模块，如上报 sdk。但是 Webpack 会把这些公共模块一并打包，导致公共模块存在两份（Taro 产物中一份，原生项目中一份）。

为了优化包体积大小，我们希望不要打包到 Taro 产物中，而是直接引用原生项目中的代码，可以使用 Webpack 的 [externals](https://webpack.js.org/configuration/externals/) 配置去实现。

#### 例子

假设以下项目结构：

    ├── miniapp           原生项目
    |   └── utils
    |       └── util.js
    └── taro-project      Taro 项目
        └── src
            └── pages
                └── index 此页面中希望引用 miniapp/utils/util.js

1. 配置 `alias`，目的是让 `externals` 更方便地筛选出不需要打包的依赖。
2. 配置 Webpack `externals`，选择出不需要打包的依赖，并计算好相对路径。
3. 设置环境变量 `process.env.NODE_ENV` 为 `production` 时，externals 生效。（当没有手动设置环境变量时，默认在 `watch` 模式时环境变量为 `development`，否则为 `production`）

```js title="config/index.js"
const config = {
  alias: {
    // 开发环境直接引用原生项目下的依赖，方便开发
    '@/utils': process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../utils') : path.resolve(__dirname, '../../miniapp/utils')
  },
  mini: {
    webpackChain (chain) {
      chain.merge({
        externals: [
          (context, request, callback) => {
            const externalDirs = ['@/utils']
            const externalDir = externalDirs.find(dir => request.startsWith(dir))

            if (process.env.NODE_ENV === 'production' && externalDir) {
              const externalDirPath = config.alias[externalDir]
              const res = request.replace('@/utils', path.relative(context, externalDirPath))

              return callback(null, `commonjs ${res}`)
            }

            callback()
          },
        ]
      })
    }
  }
}
```

```js title="taro-project/src/pages/index/index.js"
import { logSomething } from '@/utils/util'
logSomething()
```

```js title="webpack 打包结果"
{
  "./src/pages/index/index.jsx": (function(m, e, __webpack_require__) {
    var _utils_util = __webpack_require__("@/utils/util");
    // ...
  }),
  "@/utils/util": (function(module, exports) {
    module.exports = require("../../../utils/util");
  })
}
```

### 引用原生项目的原生组件

有时我们需要在 Taro 项目中引用原生项目中的公共自定义组件。

和[引用原生项目的 js 文件](./taro-in-miniapp#引用原生项目的-js-文件)一样，我们希望在开发环境能正确解析组件路径，在生产环境则直接引用原生项目的组件而不是重复打包，可以使用 Taro 的 [alias](./config-detail#alias) 配置去实现。

#### 例子

假设以下项目结构：

    ├── miniapp                原生项目
    |   └── components
    |       └── title
    |           ├── index.js
    |           ├── index.wxml
    |           ├── index.wxss
    |           └── index.json
    └── taro-project           Taro 项目
        └── src
            ├── components     把原生项目的组件拷贝过来，让开发环境能正确解析组件
            |   └── title      
            └── pages
                └── index      此页面中希望引用 miniapp/components/title

1. 把原生项目的组件拷贝到 Taro 项目，让开发环境能正确解析组件。
2. 根据开发环境和生产环境，正确配置 `alias`

```js title="config/index.js"
const config = {
  alias: {
    '@/components': process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../components') : path.resolve(__dirname, '../../miniapp/components')
  }
}
```

```js title="taro-project/src/pages/index/index.config.js"
export default {
  usingComponents: {
    title: '@/components/title/index'
  }
}
```

## 对 Taro 项目的部分页面分包

对 Taro 项目中**部分页面**进行分包。

### 依赖细分

Taro 默认会把页面共用的普通依赖打包到 `common.js`，node_modules 依赖打包到 `vendor.js`。

但是在分包时，我们会希望把**只有在分包中共用的依赖**打包到分包中，而不是打在主包的 `common.js` 和 `vendor.js` 中。这就需要我们对依赖进行细分，可以借助 Webpack 的 [splitChunk](https://webpack.js.org/plugins/split-chunks-plugin/) 和 Taro 的 [addChunkPages](./config-detail#miniaddchunkpages) 配置去实现。

#### 例子

假设以下项目结构：

    ├── dist
    |   |── common.js     公共依赖
    |   |── vendors.js    node_modules 依赖
    |   └── subPackages
    |       ├── foo
    |       ├── bar
    |       └── common.js 只有 subPackages 子包中使用的公共依赖
    └── src
        └── subPackages
            ├── foo
            └── bar

1. 使用 **Webpack splitChunks** 把只有 `subpackages` 子包独有的依赖打包到 `subpackages/common.js` 中。
2. 使用 **Taro addChunkPages** 配置，在子包中所有页面的头部添加对 `subpackages/common.js` 的引用。

```js title="config/index.js"
const config = {
  mini: {
    addChunkPages (pages) {
      pages.set('subpackages/bar/index', ['subpackages/common']),
      pages.set('subpackages/foo/index', ['subpackages/common'])
    },
    webpackChain (chain) {
      chain.merge({
        optimization: {
          splitChunks: {
            cacheGroups: {
              subpackagesCommon: {
                name: 'subpackages/common',
                minChunks: 2,
                test: (module, chunks) => {
                  const isNoOnlySubpackRequired = chunks.find(chunk => !(/\bsubpackages\b/.test(chunk.name)))
                  return !isNoOnlySubpackRequired
                },
                priority: 200
              }
            }
          }
        }
      })
    }
  }
}
```

## 把 Taro 项目作为一个完整分包

#### 1. 安装使用插件

安装插件 [@tarojs/plugin-indie](https://github.com/NervJS/taro-plugin-indie)

```bash
npm i @tarojs/plugin-indie --save-dev
```

使用插件

```js title="config/index.js"
const config = {
  plugins: [
    '@tarojs/plugin-indie'
  ]
}
```

#### 2. 以混合模式进行打包

编译项目时使用 `--blended` 参数以输出混合模式的代码。

```bash
taro build --type weapp --blended
taro build --type weapp --watch --blended
```

#### 3. 移动 Taro 项目的输出目录到原生项目内

可以编写一个** Taro 插件**自动移动，可以参考 [plugin-mv](https://github.com/NervJS/taro-blended/blob/master/taro-project/plugin-mv/index.js)。

#### 4. 设置原生项目的分包配置

## 把 Taro 组件编译为原生自定义组件

> v3.1.2+，暂时只支持 React

Taro 支持把组件编译为**原生小程序自定义组件**，供原生项目使用。

### 使用方法

#### 1. 配置组件路径

修改 `app.config.js`，增加 `components` 配置，指向组件入口文件的路径：

```js title="app.config.js"
export default {
  // ...
  components: [
    'pages/index/index',
    'components/picker/index'
  ]
}
```

#### 2. 开始编译

使用 `taro build native-components` 命令，配合参数 `type`，即可编译出对应平台的自定义组件。

```bash
taro build native-components --type [platform] [--watch]
```

### props 传递

传递 props 给 Taro 编译出来的原生自定义组件时，需要统一通过 `props` 参数来传递：

```js title="page/index/index.js"
Page({
  data: {
    pickerProps: {
      mode: 'format',
      value: [0, 0, 0],
      onInitial (value, index) {
        console.log('onInitial')
      }
    }
  }
})
```

```xml title="page/index/index.wxml"
<!--index.wxml-->
<view>
  <picker props="{{pickerProps}}"></picker>
</view>
```

```jsx title="Taro 组件 - Picker"
function Picker ({ mode, value, onInitial }) {
  return (
    // ...
  )
}
```









