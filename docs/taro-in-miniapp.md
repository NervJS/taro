---
title: 原生项目使用 Taro
---

:::info
Taro v3.0.25 开始支持
:::

## 基础混合用法

### 示例项目

[blended-basic](https://github.com/NervJS/taro/tree/next/examples/blended-basic)

### 用法

#### 1. 开发环境

1.1 推荐在 Taro 项目中进行开发调试，在生产环境下再把产物移动到原生小程序中进行预览。

```bash
# 和编译普通 Taro 项目一样
$ taro build --type [platform] --watch
```

1.2 小程序开发者工具导入 **Taro 项目**进行预览。

#### 2. 生产环境

1.1 编译项目时使用 `--blended` 参数以输出混合模式的代码。

```bash
# 以混合模式进行打包
$ taro build --type [platform] --blended
```

1.2 移动 Taro 项目的输出目录到原生项目内

也可以编写一个 **Taro 插件**自动移动，可以参考 [plugin-mv](https://github.com/NervJS/taro/blob/next/examples/blended-basic/taro-project/plugin-mv/index.js)。

1.3 原生项目的 `app.js` 中引用 Taro 入口文件

```js title="app.config.js" {2,7,12}
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

### Taro 项目引用原生项目的 JS 文件

有时我们需要在 Taro 项目中引用原生项目中的公共 JS 模块（如上报 sdk）。但是 Webpack 会把这些公共模块一并打包，导致公共模块存在两份（Taro 产物中一份，原生项目中一份）。

为了优化包体积大小，我们希望不要打包到 Taro 产物中，而是直接引用原生项目中的代码，可以使用 Webpack 的 [externals](https://webpack.js.org/configuration/externals/) 配置去实现。

#### 例子

假设以下项目结构：

    ├── miniapp           原生项目
    |   └── utils
    |       └── util.js
    └── taro-project      Taro 项目
        ├── config
        |   └── index.js 
        └── src
            └── pages
                └── index 此页面中希望引用 miniapp/utils/util.js

1. 配置 `alias`，目的是让 `externals` 更方便地筛选出不需要打包的依赖。
2. 配置 Webpack `externals`，选择出不需要打包的依赖，并计算好相对路径。
3. 设置环境变量 `process.env.NODE_ENV` 为 `production` 时，externals 生效。（当没有手动设置环境变量时，默认在 `watch` 模式时环境变量为 `development`，否则为 `production`）

```js title="config/index.js" {3,8,10,15-29}
const config = {
  alias: {
    '@/utils': process.env.NODE_ENV === 'production'
      // 生产环境路径计算：
      // Webpack 编译发生在 taro-project 下，假设编译后的 taro-project/dist 会被移到到 miniapp/taro。
      // path.resolve(__dirname, '..') 为 taro-project。taro-project/dist 之于 taro-project，相当于 miniapp/taro 之于 miniapp。
      // 再根据 miniapp/utils 与 miniapp 的相对路径，得出 path.resolve(__dirname, '../utils')
      ? path.resolve(__dirname, '../utils')
      // 开发环境直接引用原生项目下的依赖，方便开发
      : path.resolve(__dirname, '../../miniapp/utils')
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

#### 效果

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
    // 成功 external
    module.exports = require("../../../utils/util");
  })
}
```

### Taro 项目引用原生项目的原生组件

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
        ├── config
        |   └── index.js 
        └── src
            ├── components     小程序不支持引用根目录之外的组件，因此只能把原生项目的组件拷贝过来，让开发环境能正确解析组件
            |   └── title      
            └── pages
                └── index      此页面中希望引用 miniapp/components/title

1. 把原生项目的组件拷贝到 Taro 项目，让开发环境能正确解析组件。
2. 根据开发环境和生产环境，正确配置 `alias`

```js title="config/index.js" {3,8,10}
const config = {
  alias: {
    '@/components': process.env.NODE_ENV === 'production'
      // 生产环境路径计算：
      // Webpack 编译发生在 taro-project 下，假设编译后的 taro-project/dist 会被移到到 miniapp/taro。
      // path.resolve(__dirname, '..') 为 taro-project。taro-project/dist 之于 taro-project，相当于 miniapp/taro 之于 miniapp。
      // 再根据 miniapp/components 与 miniapp 的相对路径，得出 path.resolve(__dirname, '../components')
      ? path.resolve(__dirname, '../components')
      // 开发环境引用 taro-project/src 下的组件
      : path.resolve(__dirname, '../src/components')
  }
}
```

```js title="taro-project/src/pages/index/index.config.js" {3}
export default {
  usingComponents: {
    title: '@/components/title/index'
  }
}
```

### 对 Taro 项目的部分页面分包

在原生项目中直接配置 subPackages 指向 Taro 编译后的页面即可。

#### 依赖细分

Taro 默认会把页面共用的普通依赖打包为主包里的 `common.js`，node_modules 依赖打包为主包里的 `vendor.js`。

但是在分包时，我们会希望把**只有在分包中共用的依赖**打包到分包中，而不是打在主包的 `common.js` 和 `vendor.js` 中。这就需要我们对依赖进行细分。可以借助 Webpack 的 [splitChunk](https://webpack.js.org/plugins/split-chunks-plugin/) 和 Taro 的 [addChunkPages](./config-detail#miniaddchunkpages) 配置去实现。

#### 例子

假设以下项目结构：

    ├── dist
    |   |── common.js     公共依赖
    |   |── vendors.js    node_modules 依赖
    |   └── subPackages
    |       ├── foo
    |       ├── bar
    |       └── common.js 只有 subPackages 子包中使用的公共依赖
    └── src
        └── subPackages
            ├── foo
            └── bar

1. 使用 **Webpack splitChunks** 把只有 `subpackages` 子包独有的依赖打包到 `subpackages/common.js` 中。
2. 使用 **Taro addChunkPages** 配置，在子包中所有页面的头部添加对 `subpackages/common.js` 的引用。

```js title="config/index.js" {3-6,12-20}
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

### 示例项目

[blended-apart](https://github.com/NervJS/taro/tree/next/examples/blended-apart)

### 使用方法

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

#### 2. 开发环境

2.1 推荐在 Taro 项目中进行开发调试，在生产环境下再把产物移动到原生小程序中进行预览。

```bash
# 和编译普通 Taro 项目一样
$ taro build --type [platform] --watch
```

2.2 小程序开发者工具导入 **Taro 项目**进行预览。

#### 3. 生产环境

3.1 编译项目时使用 `--blended` 参数以输出混合模式的代码。

```bash
# 以混合模式进行打包
$ taro build --type [platform] --blended
```

3.2 移动 Taro 项目的输出目录到原生项目内

也可以编写一个 **Taro 插件**自动移动，可以参考 [plugin-mv](https://github.com/NervJS/taro/blob/next/examples/blended-basic/taro-project/plugin-mv/index.js)。

3.3 设置原生项目的分包配置

### 把 Taro 项目拆分到多个分包

假设有一个 Taro 项目，它含有页面 A 和页面 B。我们需要把页面 A 加入原生项目的其中一个分包 M，把页面 B 加入到另一个分包 N。

为此，和普通打出**一个分包**不同的是，首先需要配置 Webpack 的 `output.jsonpFunction` 配置，避免 `chunkid` 的冲突。

```js title="config/index.js" {7}
config = {
  mini: {
    webpackChain (chain) {
      chain.merge({
        output: {
          // 可以配合 npm script 和环境变量来动态修改
          jsonpFunction: process.env.JSONP_NAME || "webpackJsonp"
        }
      })
    }
  }
}
```

然后分别对 A、B 页面使用混合模式打包，步骤和[把 Taro 项目作为一个完整分包](./taro-in-miniapp#把-taro-项目作为一个完整分包)一致。

## 把 Taro 组件编译为原生自定义组件

:::info
Taro v3.1.2 开始支持，且暂时只支持 React
:::

Taro 支持把组件编译为**原生小程序自定义组件**，供原生项目使用。

### 示例项目

[blended-taro-component](https://github.com/NervJS/taro/tree/next/examples/blended-taro-component)

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

### 小程序自定义组件对象实例

开发者可以通过 `props.$scope` 获取到小程序的自定义组件对象实例。

使用某些小程序 API 时可能需要使用此实例，如获取视图层 DOM：

`Taro.createSelectorQuery().in(props.$scope)`

### 组件间通信与事件

支持使用两种方式进行组件间通信。

#### 使用小程序的 triggerEvent

和小程序原生自定义组件的[组件间通信与事件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html)一样，子组件使用 `triggerEvent` 发送事件。

```js title="子组件"
props.$scope.triggerEvent('myevent', myEventDetail, myEventOption)
```

#### 通过 props 传递事件回调

```js title="父组件"
Page({
  data: {
    childProps: {
      // props 里可以传递函数
      onMyEvent (value, index) {
        console.log(value, index)
      }
    }
  }
})
// 和普通 props 传递一样
<child props="{{childProps}}">
```

```js title="子组件"
props.onMyEvent(value, index)
```

### 组件配置

:::info
Taro v3.3.20 开始支持
:::

微信小程序的自定义组件支持配置 [styleIsolation](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB)、[virtualHost](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E8%99%9A%E6%8B%9F%E5%8C%96%E7%BB%84%E4%BB%B6%E8%8A%82%E7%82%B9) 等特性。在 Taro 中可以通过修改组件的配置文件进行设置：

```js title="index.config.js"
export default {
  styleIsolation: 'isolated',
  virtualHost: true
}
```
