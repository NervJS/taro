---
title: 跨平台开发
---

Taro 的设计初衷就是为了统一跨平台的开发方式，并且已经尽力通过运行时框架、组件、API 去抹平多端差异，但是由于不同的平台之间还是存在一些无法消除的差异，所以为了更好的实现跨平台开发，Taro 中提供了如下的解决方案。

## 内置环境变量

Taro 在编译时提供了一些内置的环境变量来帮助用户做一些特殊处理。

### process.env.TARO_ENV

用于判断当前的编译平台类型。

取值：`weapp` / `swan` / `alipay` / `tt` / `qq` / `jd` / `h5` / `rn` 

可以通过这个变量来区分不同环境，从而使用不同的逻辑。在编译阶段，**会移除不属于当前编译类型的代码，只保留当前编译类型下的代码**，例如：

#### 1. 在微信小程序和 H5 端分别引用不同资源：

```jsx
/** 源码 */
if (process.env.TARO_ENV === 'weapp') {
  require('path/to/weapp/name')
} else if (process.env.TARO_ENV === 'h5') {
  require('path/to/h5/name')
}

/** 编译后（微信小程序）*/
if (true) {
  require('path/to/weapp/name')
}
/** 编译后（H5）*/
if (true) {
  require('path/to/h5/name')
}
```

#### 2. 决定不同端要加载的组件

```jsx
/** 源码（React JSX） */
<View>
  {process.env.TARO_ENV === 'weapp' && <ScrollViewWeapp />}
  {process.env.TARO_ENV === 'h5' && <ScrollViewH5 />}
</View>

/** 编译后（微信小程序）*/
<View>
  {true && <ScrollViewWeapp />}
</View>
/** 编译后（H5）*/
<View>
  {true && <ScrollViewH5 />}
</View>
```

:::note
不要解构 `process.env` 来获取环境变量，请直接以完整书写的方式（`process.env.TARO_ENV`）来进行使用。

```js
// 正确写法
if (process.env.TARO_ENV === 'weapp') {}

// 错误写法
const { TARO_ENV = 'weapp' } = process.env
if (TARO_ENV === 'weapp') {}
```
:::

## 统一接口的多端文件

内置环境变量虽然可以解决大部分跨端的问题，但是会让代码中充斥着逻辑判断的代码，影响代码的可维护性，而且也让代码变得愈发丑陋。为了解决这种问题，Taro 提供了另外一种跨端开发的方式作为补充。

开发者可以通过使用**统一接口的多端文件**，来解决跨端差异的功能。针对一项功能，如果多个端之间都有差异，那么开发者可以通过将文件修改成 `原文件名 + 端类型` 的命名形式（端类型对应着 `process.env.TARO_ENV` 的取值），不同端的文件代码对外保持统一接口，而引用的时候仍然是 `import` 原文件名的文件。Taro 在编译时，会跟根据当前的编译平台类型，将加载的文件变更为带有对应端类型文件名的文件，从而达到不同的端加载对应文件的目的。

### 使用要点

统一接口的多端文件这一跨平台兼容写法有如下三个使用要点：

- 不同端的对应文件一定要**统一接口和调用方式**。
- 引用文件的时候，**只需要写默认文件名，不用带文件后缀**。
- 最好有一个平台无关的默认文件，这样在使用 TS 的时候也不会出现报错。

通常有以下三种使用场景：

### 多端组件

假如有一个 `Test` 组件存在微信小程序、百度小程序和 H5 三个不同版本，那么就可以像如下组织代码：

```
├── test.js                Test 组件默认的形式，编译到微信小程序、百度小程序和 H5 之外的端使用的版本
├── test.weapp.js          Test 组件的微信小程序版本
├── test.swan.js           Test 组件的百度小程序版本
└── test.h5.js             Test 组件的 H5 版本
```

四个文件，对外暴露的是统一的接口，它们接受一致的参数，只是内部有针对各自平台的代码实现。

而使用 `Test` 组件的时候，引用的方式依然和之前保持一致。`import` 的是**不带端类型的文件名**，在编译的时候会自动识别并添加端类型后缀：

```jsx
import Test from '../../components/test'

<Test argA={1} argA={2} />
```

### 多端脚本逻辑

与多端组件类似，假如有需要针对不同的端写不同的脚本逻辑代码，我们也可以类似的进行处理，遵守的唯一原则就是**多端文件对外的接口保持一致**。

例如微信小程序上使用 `Taro.setNavigationBarTitle` 来设置页面标题，H5 则是使用 `document.title`。那么我们可以封装一个 `setTitle` 方法来抹平两个平台的差异。

1. 编写 `set_title.weapp.js`：

```js title="set_title.weapp.js"
import Taro from '@tarojs/taro'
export default function setTitle (title) {
  Taro.setNavigationBarTitle({
    title
  })
}
```

2. 编写 `set_title.h5.js`：

```js title="set_title.h5.js"
export default function setTitle (title) {
  document.title = title
}
```

3. 调用：

```js
import setTitle from '../utils/set_title'

setTitle('页面标题')
```

### 多端页面路由

可以根据不同平台，设置不同的路由规则。例如：

```js title="app.config.js"
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

### 解析 node_modules 内的多端文件

#### 小程序 & H5

Taro 3 里的多端文件由 [MultiPlatformPlugin](https://github.com/NervJS/taro/blob/next/packages/taro-runner-utils/src/resolve/MultiPlatformPlugin.ts) 插件进行解析。

它是一个 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 插件，Taro 内部会默认加载它。但为了提高解析效率，插件**默认不解析 node_modules 中的文件**。

假设我们需要解析 NPM 包 **taro-mobile** 里面的多端文件，可以利用 WebpackChain 为 `MultiPlatformPlugin` 插件添加 `include` 配置：

```js title="config/index.js"
// mini 也可改为 h5，分别对应小程序与 h5 端配置
mini: {
  webpackChain (chain) {
    // Taro 3.1 & 3.2
    chain.resolve.plugin('MultiPlatformPlugin')
      .tap(args => {
        return [...args, {
          include: ['@taro-mobile']
        }]
      })

    // Taro 3.3+
    chain.resolve.plugin('MultiPlatformPlugin')
      .tap(args => {
         args[2]["include"] = ['@taro-mobile']
         return args
      })
  }
}
```

#### React Native

RN 端没有使用 Webpack，因此单独增加了一个配置支持：

```js title="config/index.js"
rn: {
  resolve: {
    include: ['taro-mobile'],
  }
}
```
