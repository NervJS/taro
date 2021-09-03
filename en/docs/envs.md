---
title: 跨平台开发
---

Taro 的设计初衷就是为了统一跨平台的开发方式，并且已经尽力通过运行时框架、组件、API 去抹平多端差异，但是由于不同的平台之间还是存在一些无法消除的差异，所以为了更好的实现跨平台开发，Taro 中提供了如下的解决方案

## 内置环境变量

> 注意：环境变量在代码中的使用方式，[参考](./best-practice.md#最佳编码方式)

Taro 在编译时提供了一些内置的环境变量来帮助用户做一些特殊处理

### process.env.TARO_ENV

用于判断当前编译类型，目前有 `weapp` / `swan` / `alipay` / `h5` / `rn` / `tt` / `qq` / `quickapp` 八个取值，可以通过这个变量来书写对应一些不同环境下的代码，在编译时会将不属于当前编译类型的代码去掉，只保留当前编译类型下的代码，例如想在微信小程序和 H5 端分别引用不同资源

```jsx
if (process.env.TARO_ENV === 'weapp') {
  require('path/to/weapp/name')
} else if (process.env.TARO_ENV === 'h5') {
  require('path/to/h5/name')
}
```

同时也可以在 JSX 中使用，决定不同端要加载的组件

```jsx
render () {
  return (
    <View>
      {process.env.TARO_ENV === 'weapp' && <ScrollViewWeapp />}
      {process.env.TARO_ENV === 'h5' && <ScrollViewH5 />}
    </View>
  )
}
```

## 统一接口的多端文件

> 1.2.17 开始支持

内置环境变量虽然可以解决大部分跨端的问题，但是会让代码中充斥着逻辑判断的代码，影响代码的可维护性，而且也让代码变得愈发丑陋，为了解决这种问题，自 `1.2.17` 开始，Taro 提供了另外一种跨端开发的方式作为补充。

开发者可以通过使用统一接口的多端文件，来解决跨端差异的功能。针对一项功能，如果多个端之间都有差异，那么开发者可以通过将文件修改成 `原文件名 + 端类型` 的命名形式，不同端的文件代码对外保持统一接口，而引用的时候仍然是 `import` 原文件名的文件，Taro 在编译时，会跟根据需要编译平台类型，将加载的文件变更为带有对应端类型文件名的文件，从而达到不同的端加载对应文件的目的。

端类型对应着 `process.env.TARO_ENV` 的值

通常有以下两种使用场景。

### 多端组件

假如有一个 `Test` 组件存在微信小程序、百度小程序和 H5 三个不同版本，那么就可以像如下组织代码

`test.js` 文件，这是 `Test` 组件默认的形式，编译到微信小程序、百度小程序和 H5 三端之外的端使用的版本

`test.h5.js` 文件，这是 `Test` 组件的 H5 版本

`test.weapp.js` 文件，这是 `Test` 组件的 微信小程序 版本

`test.swan.js` 文件，这是 `Test` 组件的 百度小程序 版本

`test.qq.js` 文件，这是 `Test` 组件的 QQ 小程序 版本

`test.quickapp.js` 文件，这是 `Test` 组件的 快应用 版本

四个文件，对外暴露的是统一的接口，它们接受一致的参数，只是内部有针对各自平台的代码实现

而我们使用 `Test` 组件的时候，引用的方式依然和之前保持一致，`import` 的是不带端类型的文件名，在编译的时候会自动识别并添加端类型后缀

```jsx
import Test from '../../components/test'

<Test argA={1} argA={2} />
```

### 多端脚本逻辑

与多端组件类似，假如有需要针对不同的端写不同的脚本逻辑代码，我们也可以类似的进行处理，遵守的唯一原则就是多端文件对外的接口保持一致。

例如微信小程序上使用 `Taro.setNavigationBarTitle` 来设置页面标题，H5 使用 `document.title`，那么可以封装一个 `setTitle` 方法来抹平两个平台的差异。

增加 `set_title.h5.js`，代码如下

```js title="set_title.h5.js"
export default function setTitle (title) {
  document.title = title
}
```

增加 `set_title.weapp.js`，代码如下

```js title="set_title.weapp.js"
import Taro from '@tarojs/taro'
export default function setTitle (title) {
  Taro.setNavigationBarTitle({
    title
  })
}
```

调用的时候，如下使用

```js
import setTitle from '../utils/set_title'

setTitle('页面标题')
```

### 使用要点

统一接口的多端文件这一跨平台兼容写法有如下三个使用要点

- 不同端的对应文件一定要统一接口，统一调用方式
- 最好有一个平台无关的默认文件，这样在使用 ts 的时候也不会出现报错
- 引用文件的时候，只需要写默认文件名，不用带文件后缀

### app.js 中使用不同的 pages

> 1.3.11 开始支持

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

### 让 node_modules 中的依赖也能解析多端文件

Taro 3 里的多端文件由 [MultiPlatformPlugin](https://github.com/NervJS/taro/blob/next/packages/taro-runner-utils/src/resolve/MultiPlatformPlugin.ts) 插件进行解析。

它是一个 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 插件，taro 内部会默认加载它。但插件默认不解析 node_modules 中的文件。

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
rn: {
  resolve: {
    include: ['@taro-mobile'],
  }
}
```
