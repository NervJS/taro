---
title: Overview
---

Taro 3 supports running Web frameworks directly on each platform, and developers are using real frameworks like React and Vue.

However, Taro follows the WeChat mini program specification in terms of components, APIs, routing and other specifications, so there are some differences between using React in Taro and the familiar web side for developers, which will be listed in detail below.

## React API

> [Breaking] Developers upgrading from Taro 1/2 to Taro 3 need to pay extra attention to


Because developers in Taro 3 are using the real React, React APIs such as `Component`, `useState`, `useEffect`, etc. need to be fetched from the React package.

```js
import React, { Component, useState, useEffect } from 'react'
```

## Entry components and page components

Because Taro follows the routing specification for mini program, it introduces [entry component](./react-entry) and [page component](./react-page) concepts, which correspond to the mini program specification's entry component `app` and page component `page`, respectively.

A Taro application consists of an entry component and at least one page component.

## Built-in Components

> Since Taro v3.3+, development with H5 tags is supported, see [Using HTML tags](use-h5) for details

Development in Taro can be done using built-in components of the mini program specification, such as `<View>`, `<Text>`, `<Button>`, etc.

### Taro Specifications

1. Before using these built-in components in React, they must be introduced from `@tarojs/components`.
2. Component properties follow the **Big Hump naming convention**.
3. See the next section for the event specification: [component events](./react-overall#%E4%BA%8B%E4%BB%B6).

### Example

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

Note: If a new component or property of a component added to a platform is not yet supported by Taro, you can submit [Issues](https://github.com/NervJS/taro/issues) and we will fix it as soon as possible.

## Events

Events are the same as on the web side. In the event callback function, the first argument is the event object, and calling `stopPropagation` in the callback will stop the bubbling.

### Taro Specifications

1. The built-in event names start with `on` and follow the camelCase naming convention. 
2. Use `onClick` for click events in React.

### Example Code

```jsx
function Comp () {
  function clickHandler (e) {
    e.stopPropagation()
  }

  function scrollHandler () {}

  // Only the mini program bindtap corresponds to Taro's onClick
  // The rest of the mini program event names replace bind with on, which is the Taro event name (except for the Alipay mini program, whose event starts with on)
  return <ScrollView onClick={clickHandler} onScroll={scrollHandler} />
}
```

### Taro 3 event system on the mini-program

In Taro 1 & 2, Taro determines whether the events bound in the mini program template are in the form of `bind` or `catch` depending on whether the developer uses `e.stopPropagation()`. Thus event bubbling is controlled by the mini-program.

But in Taro 3, we have implemented a system of events in the mini-program logic layer, including event triggering and event bubbling. The events bound in the mini-program template are in the form of `bind`.

In general, this system of mini-program events implemented in the logic layer works properly, with event callbacks that trigger, bubble, and stop bubbling correctly.

However, the `catchtouchmove` event bound to the mini-program template prevents the callback function from bubbling through** in addition to preventing the view from **scrolling through**, something Taro's event system cannot do.

### 阻止滚动穿透

In the previous point, we introduced the event mechanism of Taro 3. Since events are bound as `bind`, you cannot use `e.stopPropagation()` to prevent scroll-through.

Two solutions are summarized for the problem of rolling penetration:

#### 一、Style

Use the style to solve. [Disable scrolling of penetrated components](https://github.com/NervJS/taro/issues/5984#issuecomment-614502302)。

This is also the most recommended practice.

#### 二、catchMove

> Taro 3.0.21 starts to support

But the map component itself is scrollable, even if its width and height are fixed. So the first approach can't handle the scrolling events that bubble up to the map component.

This is where you can add the **catchMove** property to the `View` component.

```jsx
// This View component will bind the catchtouchmove event instead of bindtouchmove.
<View catchMove></View>
```

### dataset

#### General

We recommend thinking in terms of the DSL features of React and Vue, since `dataset` is a feature of mini program.

#### dataset

`dataset` is a special template property that allows you to get the `dataset` data in the `event` object of an event callback.

**This is supported by Taro**, and can be obtained in the event callback object via `event.target.dataset` or `event.currentTarget.dataset`.

#### Template Properties

As mentioned in the previous point, Taro's simulation of the mini program `dataset` is implemented in the **logic layer** of the mini program. **Not really setting this property in the template**.

But when there are APIs in the mini proram (e.g. `createIntersectionObserver`) that get to the node of the page, they don't get it because there is no actual corresponding property on the node.

At this point, consider using the [taro-plugin-inject](https://github.com/NervJS/taro-plugin-inject) plugin to inject some generic properties, such as:

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

## Lifecycle Trigger

Taro 3 implements a web-standard BOM and DOM API on the mini-program logic layer. So the `document.appendChild`, `document.removeChild`, and other APIs used by React are actually implemented by Taro emulation, with the end effect of rendering React's virtual DOM tree as a Web-standard DOM tree emulated by Taro.

So in Taro3, React's lifecycle trigger timing is a little different from what we normally understand in web development.

### React 的生命周期

The lifecycle methods of React components are supported in Taro.

Trigger timing：

##### 1. componentWillMount ()

After [onLoad](./react#onload-options), the page component is triggered before rendering to Taro's virtual DOM.

##### 2. componentDidMount ()

Triggered after the page component is rendered to Taro's virtual DOM.

Taro's virtual DOM is accessible at this point (using methods such as React ref, document.getElementById, etc.), and modifications to it are supported (setting the style of the DOM, etc.).

However, this does not mean that Taro's virtual DOM data has been transferred from the logical layer `setData` to the view layer. So at this point ** it is not possible to get the DOM nodes of the rendering layer of the mini program by methods like `createSelectorQuery`. ** You can only get the DOM node in [onReady](./react#onready-) lifecycle.

### Methods for mini program pages

The methods in the mini program page can also be used in Taro's page: write the methods with the same name in the Class Component and use the corresponding Hooks in the Functional Component.

**Note:**

* Mini Program page methods are not supported to the same extent on each end.
* Mini Program page components that use HOC wrappers must handle forwardRef or use inherited components instead of returned components, otherwise the mini program page method may not be triggered.

## Ref

The use of ref in Taro is exactly the same as in React, but the "DOM" obtained is different from the browser environment and the mini program environment.

### React Ref

What you get with React Ref is Taro's virtual DOM, which is similar to the browser's DOM, so you can manipulate its `style`, call its API, and so on.

However, Taro's virtual DOM runs on the mini program logic layer and is not a real mini program rendering layer node, and it has no information about the size, width, etc.

```jsx title="Example Code"
import React, { createRef } from 'react'
import { View } from '@tarojs/components'

export default class Test extends React.Component {
  el = createRef()

  componentDidMount () {
    // The obtained DOM has an API similar to that of objects like HTMLElement or Text
    console.log(this.el.current)
  }

  render () {
    return (
      <View id='only' ref={this.el} />
    )
  }
}
```

### Get Mini Program DOM

To get the real mini program rendering layer node, you need to call the API used to get the DOM in the mini program during the [onReady](react-page#onready-) lifecycle.

```jsx title="Example Code"
import React from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default class Test extends React.Component {
  onReady () {
    // onReady is triggered to get the node of the rendering layer of the mini program
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

[Hooks Document](./hooks.md)

## dangerouslySetInnerHTML

On the mini program side, there are some additional configuration options and things to note when using `dangerouslySetInnerHTML`, please refer to ["Rendering HTML"](html) for details.

## Minified React error

Because the development version of React is larger, Taro uses the production version of React as the default dependency when building mini programs to reduce the size of the mini program and to facilitate real-world previews during development.

However, the production version of React does not show the error stack when there is an error. So when you encounter an error like this: [Error: Minified React error #152]. You can change the [mini.debugReact](http://localhost:3000/taro/docs/next/config-detail#minidebugreact) option in the build configuration and turn the build back on. This will cause Taro to use the development version of React and output the error stack.

#### Error: Minified React error #152 

![](http://storage.jd.com/cjj-pub-images/minified-react-error.png)

## Other limitations

* Since mini-program do not support dynamic introduction, the `React.lazy` API cannot be used in mini-program.
* It is not possible to insert elements outside the DOM tree of a page component, so `<Portal>` is not supported.
* The `id` of all components must remain unique throughout the application (even if they are on different pages), otherwise it may cause problems with events not firing.[#7317](https://github.com/NervJS/taro/issues/7317)

##  Frequently Asked Questions

* The render layer element information is not available in `useEffect`, `componentDidMount`.[7116](https://github.com/NervJS/taro/issues/7116)
* The latest width and height of the component is not available in `useEffect` or `useLayoutEffect`.[#7491](https://github.com/NervJS/taro/issues/7491)
* When the nesting level is deep, the child elements cannot be queried using `selectorQuery`.[#7411](https://github.com/NervJS/taro/issues/7411)
