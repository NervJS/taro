---
title: Native Mini Program Project Using Taro
---

Partial use of Taro in native projects has been supported since `3.0.25`.

#### Sample Project:

[taro-blended](https://github.com/NervJS/taro-blended)

## Basic Hybrid Usage

### App Entry

#### 1. Packaged in mixed mode

Use the `-blended` argument when compiling the project to output mixed-mode code.

```bash
taro build --type weapp --blended
taro build --type weapp --watch --blended
```

#### 2. Move the output directory of the Taro project to the native project

It is possible to write a ** Taro plugin** for automatic movement, see [plugin-mv](https://github.com/NervJS/taro-blended/blob/master/taro-project/plugin-mv/index.js)。

#### 3. Referencing the Taro entry file in the native project's app.js

```js title="app.config.js"
// the entry file of the Taro project must be referenced
const taroApp = require('./taro/app.js').taroApp

App({
  onShow () {
    // Optionally, call the onShow lifecycle of the Taro project app
    taroApp.onShow()
  },

  onHide () {
    // Optionally, call the onHide lifecycle of the Taro project app
    taroApp.onHide()
  }
})
```

### Referencing JS files from native projects

Sometimes we need to reference public js modules in the native project in the Taro project, such as the reported sdk, but Webpack packages these public modules together, resulting in two copies of the public module (one in the Taro product and one in the native project).但是 Webpack 会把这些公共模块一并打包，导致公共模块存在两份（Taro 产物中一份，原生项目中一份）。

To optimize package size, we want to not package into Taro products, but instead reference code directly from the native project, which can be done using Webpack's [externals](https://webpack.js.org/configuration/externals/) configuration.

#### Example

Assume the following project structure:

    ├── miniapp           Natvie Project
    |   └── utils
    |       └── util.js
    └── taro-project      Taro Project
        └── src
            └── pages
                └── index this page need miniapp/utils/util.js

1. Configure `alias` to make it easier for `externals` to filter out dependencies that don't need to be packaged.
2. Configure Webpack `externals` to select the dependencies that do not need to be packaged and calculate the relative paths.
3. Set the environment variable `process.env.NODE_ENV` to `production` for externals to take effect.(When no environment variable is set manually, the default environment variable is `development` in `watch` mode, otherwise it is `production`)

```js title="config/index.js"
const config = {
  alias: {
    // The development environment directly references the dependencies under the native project for easy development
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
    // ... }),
  "@/utils/util": (function(module, exports) {
    module.exports = require("../../../utils/util");
  })
}
```

### Referencing native components of native projects

Sometimes we need to reference a public custom component in a native project in a Taro project.

As with [referencing the native project's js file](./taro-in-miniapp#reference-native-project-js-file), we want to resolve the component paths correctly in the development environment and reference the native project components directly in the production environment instead of repackaging them, which can be done using Taro's [alias](./config-detail#alias) configuration to achieve this.

#### Example

Assume the following project structure:

    ├── miniapp                 Natvie Project
    |   └── components
    |       └── title
    |           ├── index.js
    |           ├── index.wxml
    |           ├── index.wxss
    |           └── index.json
    └── taro-project           Taro Project
        └── src
            ├── components     Copy the components from the native project so that the development environment can parse the components correctly
            |   └── title      
            └── pages
                └── index      You want to refer to miniapp/components/title in this page

1. Copy the components from the native project to the Taro project so that the development environment can resolve the components correctly.
2. Configure `alias` correctly according to the development environment and production environment.

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

## Subpackage some pages of the Taro project

Subpackage **some pages** of the Taro project.

### Dependency Segmentation

By default, Taro will package common dependencies shared by pages into `common.js` and node_modules dependencies into `vendor.js`.

However, when subpackaging, we will want to package **only dependencies that are common to the subpackage** into the subpackage, rather than hitting `common.js` and `vendor.js` in the main package.This requires us to subdivide the dependencies, which can be done with Webpack's [splitChunk](https://webpack.js.org/plugins/split-chunks-plugin/) and Taro's \[addChunkPages\](. /config-detail#miniaddchunkpages) to do this.

#### Example

Assume the following project structure:

    ├── dist
    |   |── common.js     Public Dependence
    |   |── vendors.js    node_modules Dependence
    |   └── subPackages
    |       ├── foo
    |       ├── bar
    |       └── common.js Only public dependencies used in subPackages subpackages
    └── src
        └── subPackages
            ├── foo
            └── bar

1. Use **Webpack splitChunks** to package the dependencies unique to only the `subpackages` subpackage into `subpackages/common.js`.
2. Use **Taro addChunkPages** configuration to add references to `subpackages/common.js` in the headers of all pages in the subpackage.

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

## Taro project as a complete subcontract

### Using

#### 1. Installing and using the plugin

Installing Plugins [@tarojs/plugin-indie](https://github.com/NervJS/taro-plugin-indie)

```bash
npm i @tarojs/plugin-indie --save-dev
```

Using plugin

```js title="config/index.js"
const config = {
  plugins: [
    '@tarojs/plugin-indie'
  ]
}
```

#### 2. Packaged in mixed mode

Use the `-blended` argument when compiling the project to output mixed-mode code.

```bash
taro build --type weapp --blended
taro build --type weapp --watch --blended
```

#### 3. Move the output directory of the Taro project to the native project

It is possible to write a **Taro plugin** for automatic movement, see [plugin-mv](https://github.com/NervJS/taro-blended/blob/master/taro-project/plugin-mv/index.js)。

#### 4. Set the subcontract configuration for the native project

### Splitting Taro projects into multiple subcontracts

假设有一个 Taro 项目，它含有页面 A 和页面 B。我们需要把页面 A 加入原生项目的其中一个分包 M，把页面 B 加入到另一个分包 N。

To do this, unlike normal typing **a subpackage**, you first need to configure Webpack's `output.jsonpFunction` configuration to avoid `chunkid` conflicts.

```js title="config/index.js"
config = {
  // ... mini: {
    webpackChain (chain) {
      chain.merge({
        output: {
          // can be dynamically modified with npm script and environment variables
          jsonpFunction: process.env.JSONP_NAME || "webpackJsonp"
        }
      })
    }
  }
}
```

Then package the A and B pages separately using mixed mode, in the same way as [Taro project as a complete sub-package](./taro-in-miniapp#taro-projects-as-a-complete-subpackage).

## Compile Taro components as native custom components

> v3.1.2+, only React is supported for now

Taro supports compiling components into **native mini program custom components** for use in native projects.

### Usage

#### 1. Configuring Component Paths

Modify `app.config.js` to add `components` configuration, pointing to the path of the component entry file.

```js title="app.config.js"
export default {
  // ... components: [
    'pages/index/index',
    'components/picker/index'
  ]
}
```

#### 2. Start compiling

Use the `taro build native-components` command with the parameter `type` to compile a custom component for the corresponding platform.

```bash
taro build native-components --type [platform] [--watch]
```

### Pass props

When passing props to the native custom components compiled by Taro, they need to be passed uniformly via the `props` parameter.

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
    // ... )
}
```
