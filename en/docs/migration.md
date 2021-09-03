---
title: Migrate old version to Taro Next
---

This is a migration guide for upgrading to Taro Next users in old versions.Since the content of this chapter contains many detailed examples of elaboration and relocation, it appears to be lengthy.Don't worry, however, that Taro Next is used mostly as in the old version.**本章没有提到的内容，你可以像旧版本的 Taro 一样操作或使用**。

In fact, you do not need to change the logic code of any business. Many changes can be done using the editor's Looking/Replacement.You do not even need to read the whole chapter content (emphasis on 1,2 subsections, [API](#API) and [project/page configuration](#项目/页面配置)), only if you have a problem with a specific subsection.

Update to Taro Next first needs to update project dependencies：

```bash
# Update CLI
$ npm i -g @tarojs/cli@next
# Update project dependencies in project directories
$ npm i @tarojs/runtime@next/mini-runner@next @tarojs/components@next @tarojs/taro@next
$ npm i react @tarojs/react@next # if React
$ npm i nervjs # if Nerv
# CLI commands is the same as previous mode
$ taro build --type weapp -watch for

```

## API
在旧版本 Taro 中，我们把所有面向应用开发者的 API 都放在 `@tarojs/taro` 里，一个典型的 Taro 组件/页面会像这样：

```jsx
// Class Component
import Taro, { Component } from '@tarojs/taro'

class Wallace extends Component {
    componentDidMount() () {
      Taro. equest(). hen(/* do something */)
    }
  render () {
    return ...
    }
}

// Functional Component
import Taro, { useEffect } from '@tarojs/taro'

Function Tall () /Le
    useEffect() => {
      Taro. equest().then(/* do something */)
    }, [])
    return ...
}
```

In Taro Next, the API belonging to the framework itself was introduced from its own package, and other APIs are still being introduced from `@tarojs/taro`.It is for the developer to determine which framework to use for development.

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

> Nerv is an open source React framework for bump laboratories, size is smaller than React and performance is better in most cases than React.But there may be problems with library compatibility in some React ecology.

## Project/Page Configuration
In the old version of Taro, page/item configuration is mounted on class properties or functionally type properties, extracted through AST analysis, and then generated JSON files.But to do so, the configuration of the project page cannot be generated dynamically：

```jsx
// app. s Project configuration
class App extends Compound FLO
  config = LO
    pages: [
      'pages/index/index'
    ],
    window: File
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
  render () () () ( {
    return ...
  }
}

/index. s Page Configuration
Function Index () {
  return ...
}

Index.config = {
  navigationBarTitleText: '首页'
}

```

In Taro Next, there is a new file：`*.config.js` ,`*` on behalf of the filename of your pages/project file,`config` file must be in the same folder as a page/project file.在这个文件里你可以使用任意合法的 JavaScript 语法，只要最终把配置作为对象通过 `export default` 出去即可：

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

A full project file structure example will be like this：

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


## Use third party React Library

If you need to introduce React related ecological libraries, install it directly by `npm install` and then introduce it, Taro will no longer maintain libraries like `taro-reux` and`taro-mobile`.

```jsx
// When JSX is used, bebel will implicitly call React. CreateElement
// therefore as long as you use JSX, To introduce React or Nerv to
import React from 'react'
import { useSelector }  from 'react-redux'
// if it is used by Nerv
// import { useSelector }  from 'nerv-redux'
function Exempted ()
  const counter = useSelector(state => state. ounter)
  return ...
}
```

## Route

In an old version, you can access the details of the current component/page route through `this.$router`.在 Taro Next 对应的 API 是在 `@tarojs/taro` 中的 `getCurrentInstance().router`，两者的属性一模一样。

```jsx
Import { getCurrentInstance } from '@tarojs/taro'
class C extends Component {
  current = getCurrentInstance()

  componentWillMount () maximum
    //getCurrentInstance(). outer and this.$router is the same as the attribute
    console.log(this.current. outer)
  }
}

// Function component
import { getCurrentInstance } from '@tarojs/taro'
Function C ()
  const { router } = getCurrentInstance()
  //getCurrentInstance(). outer and useRouter returned the same content
  // const router = useRouter()
}
```

And for the project entry component, routing information is recommended for direct reading in `componentDidShow` life cycle parameters.

```jsx
//app.js Project Entry File
class App extends Component {
  componentDidShow (options/* here you want routing information */) {
  }

  render () {
    ...
  }
}
```

> A clever reader has guessed,`getCurrentInstance().router` is a shortcut to the current applet page `onLoad` life cycle parameters.

## Style

In Taro Next, there are no external styles for [components and global style](https://nervjs.github.io/taro/docs/component-style.html) , component configurations (`config.js`) are invalid, and both pages and entry files introduce CSS into global CSS without `externalClasses` and `GlobalClass`.

If you need CSS with domain CSS, consider using [CSS Modules](https://github.com/css-modules/css-modules).

## Build Configuration

* Need to add [framework configuration](https://nervjs.github.io/taro/docs/config)to extract values for used frameworks (react, nerv, vue, vue3)
* [jsxAttributeNameReplace](https://nervjs.github.io/taro/docs/1.x/config) configuration removed.Because we don't need configuration

## Compiles dependencies

`Webpack` Upgrade to `Webpack4`,`Babel` Upgrade to `babel7`.Webpack upgrades are completed in `taro2` and if you upgrade from `taro1` it may be necessary to look at [Taro 2 changes](https://github.com/NervJS/taro/blob/feat_mini_webpack/docs/config-detail.md) to see changes made with Webpack compilation.

Upgrading to `babel7` means that all your project files will be compiled through the configuration of the root directory `babel.config.js`.

## ESLint and Best Practices

`eslint-plugin-taro` has been abandoned, you no longer need to follow the restrictions it imposes.你可以发挥你的创造力使用任何合法的 JSX 语法：

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

旧版本文档所提到的[最佳实践](https://nervjs.github.io/taro/docs/1.x/best-practice.html)也不必再遵循。That is, your code will run even if you do not set up the component `defaultProps`, the custom event name will not be `on` at the beginning (there are other old versions of the code styles best practices).But it is noteworthy that following this **code style best practice** can make your code stronger and your app gains.This type of best practice may not be necessary for other hack due to the old version of Taro implementation mechanisms (e.g. render calls twice, state and props cannot be renamed and not print components).

## Ref & DOM

Taro Next maintains a streamlined DOM system on the bottom floor using `ref` linked to a Taro Element instance so you can directly operate it using a partial method [`HTMLElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement).If you need to get a native DOM instance you need to use the original [`SelectorQuery`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.html) to fetch it.

> 大部分和渲染相关的 DOM 属性你都可以通过像 Web 开发一样获取或设置（如果有必要的话你甚至可以通过 `parentNode` 和 `childNodes` 访问元素的父元素和子元素！），但元素的位置你还是必须通过原生小程序 DOM 实例的 `boundingClientRect()` 和 `scrollOffset()` 方法获取。

Also, if you are using React, you will not be able to use `ref` in the form of string.(Nerv not affected)

```jsx
class C extends Component {
  input = React.createRef()

  componentDidMount () {
    const node = this.input.current // node 是一个 Taro Element 实例
    node.focus() // ok, 在 Web 开发中常见做法

    // 以下写法也能更新视图，但不推荐这么做，更推荐使用数据来驱动视图更新
    node.setAttribute('class', 'input-css-class')
    node.className = 'input-css-class'
    node.style.fontSize = '16px'
    node.value = 'excited!'

    // 如果你需要获取原生小程序 DOM 的话
    const miniNode = Taro.createSelectorQuery().select('#' + node.id)
  }

  render () {
    return <Input ref={this.input} id='input' />
  }
}
```

> In the future, we may offer an attribute on Taro Element that allows quick access to the DOM instance.Please follow the above examples.

## Lifecycle

When you use React (using Nerv not affected), the following lifecycle has been renounced：

* `componentWillMount()` -> `UNSAFE_componentWillMount()`
* `componentWillReceiveProps` -> `UNSAFE_componentWillReceiveProps()`
* `componentWillUpdate` -> `UNSAFE_componentWillUpdate()`

Add a new life cycle: [`componentDidCatch(err, info)`](https://reactjs.org/docs/react-component.html#componentdidcatch) , provided by React or Nerv.`componentDidCatch(err, info)` triggers when the component and its descendants are throwing errors, the first argument `err` points to an error, the second argument `info` is a component call message.

> `componentDidCatch` and original `componentDidCatchError` are coexisting at `componentDidCatchError` can only be used in the entrance component (App), the lifetime of the native applet `onError()`,`componentDidch Catch` can be used in any React/Nerv class component.

## Hooks

In Taro Next,Taro[Proprietary Hooks](./hooks)(e.g. `usePageScroll`, `useReachBottom`) from `@tarojs/taro` , Split your own Hooks (e.g. `useEffect`, `useState`) is imported from the corresponding framework.

Also, old version of Taro can use hooks in class but React does not allow such behavior.

```jsx
import { usePageScroll, useReachBottom } from '@tarojs/taro' // Taro Proprietary Hooks
import { useState, useEffect } from 'react' // Framework Hooks (base Hooks)
// If you use Nerv location
// import { useState, useEffect } from 'nervjs' / / Framework Hooks (basic Hooks)
```

## $scope and $componentType

Since Taro Next has no custom components, there are no concepts `these.$scope` and `this.$componentType`.`getCurrentInstance().page` can return the instance of the current applet page.
