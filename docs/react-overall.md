---
title: 概述
---

Taro 3 支持将 Web 框架直接运行在各平台，开发者使用的是真实的 React 和 Vue 等框架。

但是 Taro 在组件、API、路由等规范上，遵循微信小程序规范，所以在 Taro 中使用 React 和开发者熟悉的 Web 端有一些差异，以下将详细列出。

## React API

> [Breaking] 从 Taro 1/2 升级到 Taro 3 的同学需要额外关注

因为在 Taro 3 中开发者使用的是真实的 React，React 的 API 如 `Component`、`useState`、`useEffect` 等都需要从 React 包中获取。

```js
// 从 'react' 包中获取 React API
import React, { Component, useState, useEffect } from 'react'
```

## 入口组件和页面组件

因为 Taro 遵循小程序的路由规范，所以引入了[入口组件](./react-entry)和[页面组件](./react-page)的概念，分别对应小程序规范的入口组件 `app` 和页面组件 `page`。

一个 Taro 应用由一个入口组件和至少一个页面组件所组成。

## 内置组件

> 自 Taro v3.3+，支持使用 H5 标签进行开发，详情请见 [使用 HTML 标签](use-h5)

Taro 中可以使用小程序规范的内置组件进行开发，如 `<View>`、`<Text>`、`<Button>` 等。

### Taro 规范

1. 在 React 中使用这些内置组件前，必须从 `@tarojs/components` 进行引入。
2. 组件属性遵从**大驼峰式命名规范**。
3. 事件规范请看下一节：[组件事件](./react-overall#%E4%BA%8B%E4%BB%B6)。

### 示例代码

```jsx
import { Swiper, SwiperItem } from '@tarojs/components'

function Index () {
  return (
    <Swiper
      className='box'
      autoplay
      interval={1000}
      indicatorColor='#999'
      onClick={() => {}}
      onAnimationFinish={() => {}}
    >
      <SwiperItem>
        <View className='text'>1</View>
      </SwiperItem>
      <SwiperItem>
        <View className='text'>2</View>
      </SwiperItem>
      <SwiperItem>
        <View className='text'>3</View>
      </SwiperItem>
    </Swiper>
  )
}
```

注意：如果某平台新增的组件或组件的属性还没被 Taro 支持，可以提交 [Issues](https://github.com/NervJS/taro/issues)，我们会尽快修复。

## 事件

事件和 Web 端一样。在事件回调函数中，第一个参数是事件对象，回调中调用 `stopPropagation` 可以阻止冒泡。

### Taro 规范

1. 内置事件名以 `on` 开头，遵从小驼峰式（camelCase）命名规范。
2. React 中点击事件使用 `onClick`。

### 示例代码

```jsx
function Comp () {
  function clickHandler (e) {
    e.stopPropagation() // 阻止冒泡
  }

  function scrollHandler () {}

  // 只有小程序的 bindtap 对应 Taro 的 onClick
  // 其余小程序事件名把 bind 换成 on 即是 Taro 事件名（支付宝小程序除外，它的事件就是以 on 开头）
  return <ScrollView onClick={clickHandler} onScroll={scrollHandler} />
}
```

### Taro 3 在小程序端的事件机制

在 Taro 1 & 2 中，Taro 会根据开发者是否使用了 `e.stopPropagation()`，来决定在小程序模板中绑定的事件是以 `bind` 还是以 `catch` 形式。因此事件冒泡是由小程序控制的。

但是在 Taro 3，我们在小程序逻辑层实现了一套事件系统，包括事件触发和事件冒泡。在小程序模板中绑定的事件都是以 `bind` 的形式。

一般情况下，这套在逻辑层实现的小程序事件系统是可以正常工作的，事件回调能正确触发、冒泡、停止冒泡。

但是，小程序模板中绑定的 `catchtouchmove` 事件除了可以阻止回调函数冒泡触发外，还能阻止视图的**滚动穿透**，这点 Taro 的事件系统是做不到的。

### 阻止滚动穿透

上一点中，我们介绍了 Taro 3 的事件机制。因为事件都以 `bind` 的形式进行绑定，因此不能使用 `e.stopPropagation()` 阻止滚动穿透。

针对滚动穿透，目前总结了两种解决办法：

#### 一、样式

使用样式解决：[禁止被穿透的组件滚动](https://github.com/NervJS/taro/issues/5984#issuecomment-614502302)。

这也是最推荐的做法。

#### 二、catchMove

> Taro 3.0.21 版本开始支持

但是地图组件本身就是可以滚动的，即使固定了它的宽高。所以第一种办法处理不了冒泡到地图组件上的滚动事件。

这时候可以为 `View` 组件增加 **catchMove** 属性：

```jsx
// 这个 View 组件会绑定 catchtouchmove 事件而不是 bindtouchmove
<View catchMove></View>
```

### dataset

#### 一般情况

我们建议按 React、 Vue 的 DSL 特性进行思考，因为 `dataset` 是小程序的特性。

#### dataset

`dataset` 是特别的模版属性，主要作用是可以在事件回调的 `event` 对象中获取到 `dataset` 相关数据。

**这点 Taro 是支持的**，在事件回调对象中可以通过 `event.target.dataset` 或 `event.currentTarget.dataset` 获取到。

#### 模板属性

上一点所说的，Taro 对于小程序 `dataset` 的模拟是在小程序的**逻辑层**实现的。**并没有真正在模板设置这个属性**。

但在小程序中有一些 API（如：`createIntersectionObserver`）获取到页面的节点的时候，由于节点上实际没有对应的属性而获取不到。

这时可以考虑使用 [taro-plugin-inject](https://github.com/NervJS/taro-plugin-inject) 插件注入一些通用属性，如：

```js title="config/index.js"
const config = {
  plugins: [
    ['@tarojs/plugin-inject', {
      components: {
        View: {
          'data-index': "'dataIndex'"
        },
        ScrollView: {
          'data-observe': "'dataObserve'",
        }
      }
    }]
  ]
}
```

## 生命周期触发机制

Taro 3 在小程序逻辑层上实现了一份遵循 Web 标准 BOM 和 DOM API。因此 React 使用的 `document.appendChild`、`document.removeChild` 等 API 其实是 Taro 模拟实现的，最终的效果是把 React 的虚拟 DOM 树渲染为 Taro 模拟的 Web 标准 DOM 树。

因此在 Taro3 中，React 的生命周期触发时机和我们平常在 Web 开发中理解的概念有一些偏差。

### React 的生命周期

React 组件的生命周期方法在 Taro 中都支持使用。

触发时机：

##### 1. componentWillMount ()

[onLoad](./react#onload-options) 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发。

##### 2. componentDidMount ()

页面组件渲染到 Taro 的虚拟 DOM 之后触发。

此时能访问到 Taro 的虚拟 DOM（使用 React ref、document.getElementById 等手段），并支持对其进行操作（设置 DOM 的 style 等）。

但此时不代表 Taro 的虚拟 DOM 数据已经完成从逻辑层 `setData` 到视图层。因此这时**无法通过 `createSelectorQuery` 等方法获取小程序渲染层 DOM 节点。** 只能在 [onReady](./react#onready-) 生命周期中获取。

### 小程序页面的方法

小程序页面的方法，在 Taro 的页面中同样可以使用：在 Class Component 中书写同名方法、在 Functional Component 中使用对应的 Hooks。

**注意：**

* 小程序页面方法在各端的支持程度不一。
* 使用了 HOC 包裹的小程序页面组件，必须处理 forwardRef 或使用继承组件的方式而不是返回组件的方式，否则小程序页面方法可能不会被触发。

## Ref

在 Taro 中 ref 的用法和 React 完全一致，但是获取到的 “DOM” 和浏览器环境还有小程序环境都有不同。

### React Ref

使用 React Ref 获取到的是 Taro 的虚拟 DOM，和浏览器的 DOM 相似，可以操作它的 `style`，调用它的 API 等。

但是 Taro 的虚拟 DOM 运行在小程序的逻辑层，并不是真实的小程序渲染层节点，它没有尺寸宽高等信息。

```jsx title="示例代码"
import React, { createRef } from 'react'
import { View } from '@tarojs/components'

export default class Test extends React.Component {
  el = createRef()

  componentDidMount () {
    // 获取到的 DOM 具有类似 HTMLElement 或 Text 等对象的 API
    console.log(this.el.current)
  }

  render () {
    return (
      <View id='only' ref={this.el} />
    )
  }
}
```

### 获取小程序 DOM

获取真实的小程序渲染层节点，需要在 [onReady](react-page#onready-) 生命周期中，调用小程序中用于获取 DOM 的 API。

```jsx title="示例代码"
import React from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default class Test extends React.Component {
  onReady () {
    // onReady 触发后才能获取小程序渲染层的节点
    Taro.createSelectorQuery().select('#only')
      .boundingClientRect()
      .exec(res => console.log(res))
  }

  render () {
    return (
      <View id='only' />
    )
  }
}
```

## Hooks

[Hooks 文档](./hooks.md)

## Minified React error

因为 development 版本的 React 体积较大，为了减少小程序体积，方便开发时真机预览。Taro 在构建小程序时默认使用 production 版本的 React 相关依赖。

但是 production 版本的 React 出错时不会展示报错堆栈的信息。因此当你遇到类似这种报错时：【Error: Minified React error #152】。可以修改编译配置中的 [mini.debugReact](http://localhost:3000/taro/docs/next/config-detail#minidebugreact) 选项，然后重新开启编译。这样 Taro 会使用 development 版本的 React，从而输出报错堆栈。

#### Error: Minified React error #152 报错

![](http://storage.jd.com/cjj-pub-images/minified-react-error.png)

## 其它限制

* 由于小程序不支持动态引入，因此小程序中无法使用 `React.lazy` API。
* 不能在页面组件的 DOM 树之外插入元素，因此不支持 `<Portal>`。
* 所有组件的 `id` 必须在整个应用中保持唯一（即使他们在不同的页面），否则可能导致事件不触发的问题，[#7317](https://github.com/NervJS/taro/issues/7317)

## 常见问题

* `useEffect`、`componentDidMount` 中获取不到渲染层元素信息，[7116](https://github.com/NervJS/taro/issues/7116)
* `useEffect` 或 `useLayoutEffect` 中获取不到组件最新的宽高，[#7491](https://github.com/NervJS/taro/issues/7491)
* 嵌套层级较深时，使用 `selectorQuery` 无法查询到子元素，[#7411](https://github.com/NervJS/taro/issues/7411)
