---
title: cross-platform development
---

Taro was designed to unify cross-platform development and has made every effort to wipe out multi-end differences through the running timeframe, components, API, but because there are some intractable differences between the platforms, Taro offers the following solutions for better cross-platform development.

## Built Environment Variables

> Note how：environment variables are used in the code,[reference](./best-practice.md#最佳编码方式)

Taro compiles some built-in environmental variables to help users make some special handling

### process.env.TARO_ENV

To judge the current compilation type, Previous `weapp` / `swan` / `alipay` / `h5` / `rn` / `tt` / `qq` / `quickapp` values, 15 values, Write code in this variable that corresponds to some different environments and remove code that does not belong to the current compilation type when compiled, keeping only the code under the current compilation type, such as trying to quote different resources in the microletter applet and the H5 end

```jsx
if (process.env.TARO_ENV ==== 'weapp') LOs
  required ('path/to/weapp/name')
} else if (process.env.TARO_ENV ==== 'h5') {
  require('path/to/h5/name')
}
```

Also available in JSX, deciding which components to load from different ends

```jsx
render () LO
  return (
    <View>
      {process. nv.TARO_ENV === 'weapp' && <ScrollViewWeapp />}
      {process. nv.TARO_ENV === 'h5' && <ScrollViewH5 />}
    </View>
  )
}
```

## Unified Interface Multiside Files

> 1.2.17 Start support

Built-in environment variables, although they solve most cross-end problems, will allow the code to be filled with logically judged, affect the maintenance of the code, and also make the code more ugly and, starting with `1.2.17` , Taro provides another form of cross-end development.

The developer can solve cross-end differences by using a single interface multi-end file.For one feature, if there is a difference between multiple parties, the developer can change the file to the naming form of `the original filename + end type` and the file code of the different end still maintains a uniform interface, which is still referenced as `import` the original filename file. Taro compiles the platform type as necessary, changes the loaded file to the file with the corresponding type file, thus achieving different ends' purpose of loading the corresponding file.

The value of the end type `process.env.TARO_ENV`

Usually there are two scenarios of use.

### Multi Component

If there is a `Test` component that has three different versions of the micromessenger, 100 applet, and H5, then you can have the following organization code

`test.js` Files, this is `Test` The default form of components compiled into versions used outside of the micromessenger, the 100 applet and the H5 end

`test.h5.js` file, it's H5 version of `Test` component

`test.weapp.js` file, this is `Test` version of the widget

`test.swan.js` file, this is `Test` the 100th version of the component

`test.qq.js` file, this is the QQ applet version of `Test` component

`test.quickapp.js` file, this is the fast app version of `Test` component

Four documents, exposing them to uniform interfaces that accept consistent parameters, except for internal code implementation for their respective platforms

And when we use `Test` components, the referenced method remains the same as before,`import` is a file name with no end type. Automatically identify and add endtype suffix when compiled.

```jsx
Import Test from '../../components/test'

<Test argA={1} argA={2} />
```

### Multi-Scripting Logic

Similar to multiple-end components, if there is a need to write different scripting logic codes for different ends, we can do so similarly. The only principle to follow is consistency of multi-end documents with external interfaces.

例如微信小程序上使用 `Taro.setNavigationBarTitle` 来设置页面标题，H5 使用 `document.title`，那么可以封装一个 `setTitle` 方法来抹平两个平台的差异。

Add `settle_title.h5.js`with the following code

```js title="set_title.h5.js"
export default function title (title) LOs
  document.title = title
}
```

Add `settle_title.weapp.js`with the following code

```js title="set_title.weapp.js"
import Taro from '@tarojs/taro'
export default function settlement Title (title) maximum
  Taro.setNavigationBarTitle({
    title
  })
}
```

On call, use below

```js
import settlement from '../utils/settle_title'

setTitle('page title')
```

### Points of use

Unified Interface Multipurpose Files, cross-platform compatible with the following three elements of usage:

- Unified interfaces are required for matching files from different ends and uniform mode of call
- It would be better to have a default file without a platform, so there is no error reporting when using it
- Just write the default filename when referencing a file without suffix

### Use different pages in app.js

> 1.3.11 Start support

根据不同环境返回不同的 `pages`，可以这么写

```js
let pages = []
if (process.env.TARO_ENV === 'weapp') {
  pages = [
    '/pages/index/index'
  ]
}
if (process.env.TARO_ENV === 'swan') {
  pages = [
    '/pages/indexswan/indexswan'
  ]
}
export default {
  pages
}
```

### Makes reliance in node_modules parse multi-party files

Multi-end files in Taro 3 are parsed by [MultiPlatformPlugins](https://github.com/NervJS/taro/blob/next/packages/taro-runner-utils/src/resolve/MultiPlatformPlugin.ts) plugins.

It is a [enhanced-resolution](https://github.com/webpack/enhanced-resolve) plugin, taro will load it internally by default.The plugin does not parse files in node_modules by default.

假如我们有一个 npm 包名叫 @taro-mobile，需要解析里面的多端文件，可以在 taro 的配置文件中这样修改 MultiPlatformPlugin 的配置：

```js title="/config/index.js"
// mini 也可改为 h5，分别对应小程序与 h5 端配置
mini: {
  webpackChain (chain) {
    chain.resolve.plugin('MultiPlatformPlugin')
      .tap(args => {
        return [...args, {
          include: ['@taro-mobile']
        }]
      })
  }
}
```
Taro 3 RN 端没有使用 webpack，所以不能跟其他端一致 ，这里需增加了一个配置支持：
```js title="/config/index.js"
rn: LO
  resolve: LO
    include: ['@taro-mobile'],
  }
}
```
