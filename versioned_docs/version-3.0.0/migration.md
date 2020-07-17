---
title: 从旧版本迁移到 Taro Next
---

这是一篇针对旧版本用户升级到 Taro Next 的迁移指南。因为本章内容包含了许多详尽的阐述和迁移例子，所以看起来有一些长。但请不要担心，Taro Next  大部分用法还是和旧版本一样的。**本章没有提到的内容，你可以像旧版本的 Taro 一样操作或使用**。

事实上，你并不需要去更改任何业务的逻辑代码，许多更改使用编辑器的「查找/替换」就可以完成。你甚至不需要完整地阅读整章内容（重点在 1，2 小节， [API](#API) 和 [项目/页面配置](#项目/页面配置)），只有当出问题时定位到具体的小节即可。

更新到 Taro Next 首先需要更新项目依赖：

```bash
# 更新 CLI
$ npm i -g @tarojs/cli@next
# 在项目目录更新项目依赖
$ npm i @tarojs/runtime@next @tarojs/mini-runner@next @tarojs/components@next @tarojs/taro@next
$ npm i react @tarojs/react@next # 如果使用 React
$ npm i nervjs # 如果使用 Nerv
# CLI 命令和以前一模一样
$ taro build --type weapp --watch
```

## API
在旧版本 Taro 中，我们把所有面向应用开发者的 API 都放在 `@tarojs/taro` 里，一个典型的 Taro 组件/页面会像这样：

```jsx
// 类组件
import Taro, { Component } from '@tarojs/taro'

class Wallace extends Component {
	componentDidMount () {
	  Taro.request().then(/* do something */)
	}
  render () {
    return ...
	}
}

// 函数式组件
import Taro, { useEffect } from '@tarojs/taro'

function Tall () {
	useEffect(() => {
	  Taro.request().then(/* do something */)
	}, [])
	return ...
}
```

在 Taro Next 中，属于框架本身的 API 从框架自己的包中引入，其它的 API 仍然从 `@tarojs/taro` 引入。使用哪个框架来进行开发完全由开发者来决定。

```jsx
import Taro from '@tarojs/taro'
import React, { Component }  from 'react' // Component 是来自于 React 的 API
// 从 nervjs 中引入，那运行的就是 Nerv
// import { Component } from 'nervjs'

class Reporter extends Component {
  componentDidMount () {
    Taro.request().then(/* do something */)
  }
  render () {
    return ...
  }
}

// 函数式组件
import Taro from '@tarojs/taro'
// useEffect 是来自于 React 的 API
import React, { useEffect }  from 'react'
// 从 nervjs 中引入，那运行的就是 Nerv
// import { useEffect } from 'nervjs'

function Fast () {
  useEffect(() => {
    Taro.request().then(/* do something */)
  }, [])
  return ...
}
```

> Nerv 是凹凸实验室的一个开源类 React 框架，体积比 React 更小，多数情况性能表现也比 React 更好。但某些 React 生态的库兼容性可能会出现问题。

## 项目/页面配置
在旧版本 Taro 中，页面/项目的配置挂载在类组件的类属性或函数式的属性上，通过 AST 分析取出来，然后生成 JSON 文件。但这样做，项目页面的配置就无法动态地生成：

```jsx
// app.js 项目配置
class App extends Component {
  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
  render () {
    return ...
  }
}

// index.js 页面配置
function Index () {
  return ...
}

Index.config = {
  navigationBarTitleText: '首页'
}

```

在 Taro Next 中，会有一个新的文件：`*.config.js` ，`*` 代表你页面/项目文件的文件名，`config` 文件必须和页面/项目文件在同一文件夹。在这个文件里你可以使用任意合法的 JavaScript 语法，只要最终把配置作为对象通过 `export default` 出去即可：

```jsx
// app.js 项目文件
class App extends Component {
  render () {
    return ...
  }
}

// app.config.js
export default {
  pages: [
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}

// index.js 页面文件
function Index () {
  return ...
}

// index.config.js 页面配置
const title = '首页'
export default {
  navigationBarTitleText: title
}
```

一个完整的项目文件结构示例会像这样：

```
.
├── app.config.js // 入口文件项目配置
├── app.js
├── app.scss
├── components
│   └── result.js // 组件若不使用第三方组件则无需配置
└── pages
    └── index
        ├── index.config.js // index 的页面配置
        └── index.js
```


## 使用第三方 React 库

如果你需要引入 React 相关生态的库，直接通过 `npm install` 安装然后引入使用即可，Taro 不会再维护类似于 `taro-redux` 、`taro-mobx` 之类的库。

```jsx
// 当使用了 JSX 时，babel 会隐式地调用 React.createElement
// 因此只要你使用了 JSX，就要把 React 或 Nerv 引入
import React from 'react'
import { useSelector }  from 'react-redux'
// 如果是使用的是 Nerv
// import { useSelector }  from 'nerv-redux'
function Excited () {
  const counter = useSelector(state => state.counter)
  return ...
}
```

## 路由

在旧版本中可以通过 `this.$router` 访问当前组件/页面路由的详情。在 Taro Next 对应的 API 是在 `@tarojs/taro` 中的 `getCurrentInstance().router`，两者的属性一模一样。

```jsx
import { getCurrentInstance } from '@tarojs/taro'
class C extends Component {
  current = getCurrentInstance()

  componentWillMount () {
    // getCurrentInstance().router 和 this.$router 和属性一样
    console.log(this.current.router)
  }
}

// 函数式组件
import { getCurrentInstance } from '@tarojs/taro'
function C () {
  const { router } = getCurrentInstance()
  // getCurrentInstance().router 和 useRouter 返回的内容也一样
  // const router = useRouter()
}
```

而对于项目入口组件而言，路由信息我们推荐在 `componentDidShow` 生命周期的参数中直接读取。

```jsx
// app.js 项目入口文件
class App extends Component {
  componentDidShow (options /* 这里有你想要的路由信息 */) {
  }

  render () {
    ...
  }
}
```

> 聪明的读者已经猜到了，`getCurrentInstance().router` 其实是访问小程序当前页面 `onLoad` 生命周期参数的快捷方式。

## 样式

在 Taro Next 中，没有 [组件的外部样式和全局样式](https://nervjs.github.io/taro/docs/component-style.html) 的概念，组件的配置（`config.js`）是无效的，页面和入口文件引入的 CSS 都会变成全局 CSS ，没有了 `externalClasses` 和 `addGlobalClass` 这两个概念。

如果你需要带作用域的 CSS，可以考虑使用 [CSS Modules](https://github.com/css-modules/css-modules)。

## 编译配置

* 需要添加 [framework 配置](https://nervjs.github.io/taro/docs/config)，取值为使用的框架（react, nerv, vue, vue3）
* [jsxAttributeNameReplace](https://nervjs.github.io/taro/docs/1.3.24/config.html) 配置已被移除。因为我们不需要配置 `externalClasses`，这个属性也失去了它存在的意义。

## 编译依赖库

`Webpack` 升级到 `Webpack@4`，`Babel` 升级到 `babel@7`。Webpack 升级是在 `taro@2` 中完成的，如果你是从 `taro@1` 升级上来的话，或许需要去看看 [Taro 2 更改](https://github.com/NervJS/taro/blob/feat_mini_webpack/docs/config-detail.md) 查看使用 Webpack 编译后带来的变化。

升级到 `babel@7` 意味着你的项目文件全部都会通过根目录的 `babel.config.js` 的配置进行编译。

## ESLint 和最佳实践

`eslint-plugin-taro` 已被废弃，你不再需要遵循它所规定的种种限制。你可以发挥你的创造力使用任何合法的 JSX 语法：

```jsx
import React from 'react'
import { View, Text } from '@tarojs/components'
function C () {
  // 你可以选择不使用 JSX，但元素还是必须从 `@tarojs/components` 引入
  const title = React.createElement(View, null, 'Numbers:')

  const numbers = []
  for (let i = 0; i < 10; i++) {
    numbers.push(<Text key={i}>{i}</Text>)
  }

  return <>
    {title}
    {numbers}
  </>
}
```

旧版本文档所提到的[最佳实践](https://taro-docs.jd.com/taro/docs/1.3.24/best-practice.html)也不必再遵循。也就是说，即便你不给组件设置 `defaultProps`，自定义事件名不以 `on` 开头（还有其它的旧版本代码风格最佳实践），你的代码也能运行。但值得注意的是，遵循这样的 **代码风格最佳实践** 可以让你的代码更健壮，你的应用也会因此而收益。而对于另外的一些由于旧版本 Taro 执行机制的 hack（例如 render 调用两次，state 和 props 无法重名，不要打印组件），这类最佳实践可以不必理会。

## Ref & DOM

Taro Next 在底层会维护一个精简的 DOM 系统，在框架中使用 `ref` 链接到的是一个 Taro Element 实例，因此你直接可以使用 [`HTMLElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement) 的部分方法直接操作它。如果你需要获取原生小程序 DOM 实例，那需要使用原生小程序的 [`SelectorQuery`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.html) 来获取。

> 大部分和渲染相关的 DOM 属性你都可以通过像 Web 开发一样获取或设置（如果有必要的话你甚至可以通过 `parentNode` 和 `childNodes` 访问元素的父元素和子元素！），但元素的位置你还是必须通过原生小程序 DOM 实例的 `boundingClientRect()` 和 `scrollOffset()` 方法获取。

另外，如果你使用的是 React，就将无法使用字符串的形式来使用 `ref`。(Nerv 不受此影响)

```jsx
class C extends Components {
  input = React.createRef()

  componentDidMount () {
    const node = this.input.current // node 是一个 Taro Element 实例
    node.focus() // ok, 在 Web 开发中常见做法

    // 以下写法也能更新视图，但不推荐这么做，更推荐使用数据来驱动视图更新
    node.setProerty('class', 'input-css-class')
    node.className = 'input-css-class'
    node.style.fontSize = '16px'
    node.value = 'excited!'

    // 如果你需要获取原生小程序 DOM 的话
    const miniNode = Taro.createSelectorQuery().select('#' + node.id)
  }

  render () {
    return <Input ref={this.input} />
  }
}
```

> 在未来，我们可能会在 Taro Element 上提供一个可以快速访问小程序 DOM 实例的属性。目前请按照上述例子使用。

## 生命周期

当你使用 React 时（使用 Nerv 不受此影响），以下生命周期被更名：

* `componentWillMount()` -> `UNSAFE_componentWillMount()`
* `componentWillReceiveProps` -> `UNSAFE_componentWillReceiveProps()`
* `componentWillUpdate` -> `UNSAFE_componentWillUpdate()`

新增一个生命周期: [`componentDidCatch(err, info)`](https://reactjs.org/docs/react-component.html#componentdidcatch) ，这是由框架本身（React 或 Nerv）提供的。`componentDidCatch(err, info)` 会在组件和它的子孙抛出错误时触发，第一个参数 `err` 指向抛出的错误，第二个参数 `info` 是组件的调用信息。

> `componentDidCatch` 和原有的 `componentDidCatchError` 共同存在，区别在于 `componentDidCatchError` 只能在入口组件（App）中使用，对应原生小程序的生命周期 `onError()`，`componentDidCatch` 可以在任何 React/Nerv 类组件中使用（包括入口组件）。

## Hooks

在 Taro Next，Taro 的[专有 Hooks](https://nervjs.github.io/taro/docs/1.3.25/hooks.html)（例如 `usePageScroll`, `useReachBottom`）从 `@tarojs/taro` 中引入，框架自己的 Hooks （例如 `useEffect`, `useState`）从对应的框架引入。

另外，旧版本的 Taro 可以在 Class Component 中使用 Hooks，但 React 是不允许这样的行为的。

```jsx
import { usePageScroll, useReachBottom } from '@tarojs/taro' // Taro 专有 Hooks
import { useState, useEffect } from 'react' // 框架 Hooks （基础 Hooks）
// 如果你使用 Nerv 的话
// import { useState, useEffect } from 'nervjs' // 框架 Hooks （基础 Hooks）
```

## $scope 和 $componentType

由于 Taro Next 没有自定义组件，所以也没有了 `this.$scope` 和 `this.$componentType` 的概念。`getCurrentInstance().page` 可以返回当前小程序页面的实例。
