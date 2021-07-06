---
title: React
---

Taro supports development with React, but it is slightly different from using React in the browser, in the following ways: 

## Entry Component

Every Taro application needs an entry component to register the application. The default entry file is `app.js` in the `src` directory.

To use React in Taro, the entry component must export a React component. In the entry component we can set the global state or access the lifecycle of the mini-program entry instance

```jsx title="app.js"
import React, { Component } from 'react'

// If we use the Redux
import { Provider } from 'react-redux'
import configStore from './store'

// Global Style
import './app.css'

const store = configStore()

class App extends Component {
  // All React component methods can be used
  componentDidMount () {}

  // onLaunch
  onLaunch () {}

  //  onShow
  componentDidShow () {}

  //  onHide
  componentDidHide () {}

  render () {
    // Nothing will be rendered in the entry component, but we can do something like state management here
    return (
      <Provider store={store}>
        /* this.props.children is the page that will be rendered */
        {this.props.children}
      </Provider>
    )
  }
}

export default App
```

### onLaunch (options)

> `onLaunch` of the corresponding app in the mini-program.

Program initialization parameters can be accessed during this lifecycle by accessing the `options` parameter or by calling `getCurrentInstance().router`.

#### Parameters

##### options

| Proerty | Type |  Description |
| - | - | - |
| path | string | Path for launch mini-program |
| scene | number | Scene values for launch mini-program |
| query | Object | Parameters for launch mini-program |
| shareTicket | string | shareTicket，See Get More Forwarding Information |
| referrerInfo | Object | Source information. Source information. Returned when accessing an mini-program from another mini-program, public number or app. Otherwise returns {} |


##### options.referrerInfo

| Proerty | Type |  Description |
| - | - | - |
| appId | string | Source mini-program, or public number (in WeChat)） |
| extraData | Object | The data passed from the source mini-program is supported by WeChat and Baidu smart-program at scene=1037 or 1038  |
| sourceServiceId | string | Source plugin, visible when in plugin run mode |

>  The options parameter may vary from field to field in different mini-program
>
> Scenario values , there are differences in WeChat Mini-program and Baidu Smart-program, please refer to them respectively  [Wechat Mini-program](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) 和 [Baidu Smart-program Documents](https://smartprogram.baidu.com/docs/data/scene/)

### componentDidShow (options)

Triggered when the program is started, or foregrounded.

As with the `onLaunch` lifecycle, program initialization parameters can be accessed during this lifecycle by accessing the `options` parameter or calling `getCurrentInstance().router`.

The parameters are basically the same as those obtained in `onLaunch`, but with two additional parameters in **Baidu Smart-program** as follows.

| Proerty | Type | Description |
| - | - | - |
| entryType | string | Source identifier, take the value of user/ schema /sys :<br />user：Indicates before and after passing home<br/>Switching or unlocking the screen, etc. to bring up.<br/>schema：Indicates a protocol call-up;<br />sys：Other |
| appURL | string | The call-up protocol at the time of the presentation, which exists only if the value of entryType is schema |

### componentDidHide ()

Triggered when the program switches to the background.

### onPageNotFound (Object)

Triggered when the page to be opened by the program does not exist.

#### Parameters
##### Object

| Proerty | Type | Description |
| - | - | - |
| path | string | Path to non-existent page |
| query | Object | Open the query parameter of a non-existent page |
| isEntryPage | boolean | Whether it is the first page of this launch |


## Page Components

Every Taro application includes at least one page component, which can jump through Taro routes and also access the lifecycle of the mini-program page.

```jsx title="Class Component"
import React, { Component } from 'react'
import { View } from '@tarojs/components'

class Index extends Component {
  // All React component methods can be used
  componentDidMount () {}

  // onLoad
  onLoad () {}

  // onReady
  onReady () {}

  // onShow
  componentDidShow () {}

  // onHide
  componentDidHide () {}

  // onPullDownRefresh，except for componentDidShow/componentDidHide 
  // All page lifecycle function names correspond to mini-program
  onPullDownRefresh () {}

  render () {
    return (
      <View className='index' />
    )
  }
}

export default Index
```

```jsx title="Functional Component"
import React, { useEffect } from 'react'
import { View } from '@tarojs/components'
import {
  useReady,
  useDidShow,
  useDidHide,
  usePullDownRefresh
} from '@tarojs/taro'

function Index () {
  // All React Hooks can be used
  useEffect(() => {})

  // onReady
  useReady(() => {})

  // onShow
  useDidShow(() => {})

  // onHide
  useDidHide(() => {})

  // Taro implements custom React Hooks for all mini-program page lifecycles to support
  usePullDownRefresh(() => {})

  return (
    <View className='index' />
  )
}

export default Index
```

### Routing parameters

In the page component, the routing parameters for the current page can be obtained via `getCurrentInstance().router`.

```jsx
import React, { Component } from 'react'
import { View } from '@tarojs/components'

class Index extends Component {
  // It is recommended that the result of getCurrentInstance() be saved for later use when the page is initialized.
  //  instead of calling this API frequently
  $instance = getCurrentInstance()

  componentDidMount () {
    // Get router parameters
    console.log($instance.router)
  }

  render () {
    return (
      <View className='index' />
    )
  }
}

export default Index
```

### Lifecycle Trigger

Taro 3 implements a web-standard BOM and DOM API on the mini-program logic layer. So the `document.appendChild`, `document.removeChild`, and other APIs used by React are actually implemented by Taro emulation, with the end effect of rendering React's virtual DOM tree as a Web-standard DOM tree emulated by Taro.

So in Taro3, React's lifecycle trigger timing is a little different from what we normally understand in web development.

#### React lifecycle

The lifecycle methods of React components are supported in Taro.

Trigger timing：

##### 1. componentWillMount ()

After [onLoad](./react#onload-options), the page component is triggered before rendering to Taro's virtual DOM.

##### 2. componentDidMount ()

Triggered after the page component is rendered to Taro's virtual DOM.

Taro's virtual DOM is accessible at this point (using methods such as React ref, document.getElementById, etc.), and modifications to it are supported (setting the style of the DOM, etc.).

However, this does not mean that Taro's virtual DOM data has been transferred from the logical layer `setData` to the view layer. So at this point ** it is not possible to get the DOM nodes of the rendering layer of the applet by methods like `createSelectorQuery`. ** You can only get the DOM node in [onReady](./react#onready-) lifecycle.


#### Methods for mini-program pages

The methods in the mini-program page can also be used in Taro's page: write the methods with the same name in the Class Component and use the corresponding Hooks in the Functional Component.

**Attention:**

*  Mini-program page methods also differ across platforms
*  Mini-program page components that use HOC wrappers must handle forwardRef or use inherited components instead of returned components, otherwise the applet page method may not be triggered.

### onLoad (options)

> `onLoad` of the corresponding page in the mini-program.

Page routing parameters can be accessed during this lifecycle by accessing the `options` parameter or by calling `getCurrentInstance().router`.

### onReady ()

> `onReady` of the corresponding page in the mini-program.

This lifecycle begins with access to the DOM nodes of the mini-program rendering layer using APIs such as `createCanvasContext` or `createSelectorQuery`.

#### The onReady of the child component

The `onReady` lifecycle is only triggered for page components.
Child components can use Taro's built-in [Message System](./apis/about/events) to listen to the `onReady()` lifecycle of the page component.


```jsx title="A child component in a page"
import React from 'react'
import { View } from '@tarojs/components'
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro'

class Test extends React.Component {
  $instance = getCurrentInstance()

  componentWillMount () {
    const onReadyEventId = this.$instance.router.onReady
    eventCenter.once(onReadyEventId, () => {
      console.log('onReady')

      Taro.createSelectorQuery().select('#only')
        .boundingClientRect()
        .exec(res => console.log(res, 'res'))
    })
  }

  render () {
    return (
      <View id="only">
      </View>
    )
  }
}
```

But when the child component is **load-on-demand**, the page `onReady` has already been triggered. If this on-demand subcomponent needs to get the DOM node of the rendering layer of the applet because it missed the page `onReady`, it can only try to simulate it using `Taro.nextTick`.


```jsx title="Load-on-demand subcomponents"
import React from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

class Test extends React.Component {
  componentDidMount () {
    Taro.nextTick(() => {
      // Use Taro.nextTick to simulate that setData has ended and the node has finished rendering
      Taro.createSelectorQuery().select('#only')
        .boundingClientRect()
        .exec(res => console.log(res, 'res'))
    })
  }

  render () {
    return (
      <View id="only" />
    )
  }
}
```

### componentDidShow ()

> `onShow` of the corresponding page in the mini-program.

Triggered when the page is displayed/entered in the foreground.

#### The onShow of the Subcomponents

The `onShow` lifecycle is only triggered for page components.
Subcomponents can use Taro's built-in [message system](./apis/about/events) to listen to the `onShow()` lifecycle of the page component.


```jsx title="A sub-component of the page"
import React from 'react'
import { View } from '@tarojs/components'
import { eventCenter, getCurrentInstance } from '@tarojs/taro'

class Test extends React.Component {
  $instance = getCurrentInstance()

  componentWillMount () {
    const onShowEventId = this.$instance.router.onShow
    eventCenter.on(onShowEventId, this.onShow)
  }

  componentWillUnmount () {
    const onShowEventId = this.$instance.router.onShow
    eventCenter.off(onShowEventId, this.onShow)
  }

  onShow = () => {
    console.log('onShow')
  }

  render () {
    return (
      <View id="only" />
    )
  }
}
```

### componentDidHide ()

> `onHide` of the corresponding page in the mini-program.

Triggered when the page is hidden/entered in the background.

#### The onHide of a subcomponent

The `onHide` lifecycle is only triggered for page components.
Subcomponents can use Taro's built-in [message system](./apis/about/events) to listen to the `onHide()` lifecycle of the page component.

```jsx title="A sub-component of the page"
import React from 'react'
import { View } from '@tarojs/components'
import { eventCenter, getCurrentInstance } from '@tarojs/taro'

class Test extends React.Component {
  $instance = getCurrentInstance()

  componentWillMount () {
    const onHideEventId = this.$instance.router.onHide
    eventCenter.on(onHideEventId, this.onHide)
  }

  componentWillUnmount () {
    const onHideEventId = this.$instance.router.onHide
    eventCenter.off(onHideEventId, this.onHide)
  }

  onHide = () => {
    console.log('onHide')
  }

  render () {
    return (
      <View id="only" />
    )
  }
}
```

### onPullDownRefresh ()

Listen to the user drop-down action.

- You need to set it in the window option of the global configuration or in the page configuration
`enablePullDownRefresh: true`.
- The pull-down refresh can be triggered by [Taro.startPullDownRefresh](./apis/ui/pull-down-refresh/startPullDownRefresh.md), which triggers the pull-down refresh animation after the call, and the effect is the same as the user's manual pull-down refresh.
- When the data has been processed and refreshed, [Taro.stopPullDownRefresh](./apis/ui/pull-down-refresh/stopPullDownRefresh.md) You can stop the drop-down refresh of the current page.

### onReachBottom ()

Listen to the user pull-up bottoming event.


- The trigger distance can be set in the window option of the global configuration or in the page configuration  `onReachBottomDistance`。
- This event will only be triggered once during the slide within the trigger distance

> H5 does not have synchronization for now, you can simulate it by binding scroll events to window

### onPageScroll (Object)

Listening to user swipe page events

>H5 does not have synchronization for now, you can simulate it by binding scroll events to window

#### Parameters

##### Object

| Parameters | Type | Description |
| - | - | - |
| scrollTop | Number | The distance the page has scrolled in the vertical direction (unit: px)|


### onAddToFavorites (Object)

Listen to the user's click on the "Favorites" button in the upper-right corner of the menu and customize the contents of the favorites.

> Supported by Taro 3.0.3 and above.
> Only supported by WeChat mini-program , this interface is Beta version, supported from Android version 7.0.15, only supported in Android platform for now.

#### Parameters

##### Object

| Parameters | Type | Description |
| - | - | - |
| webviewUrl | String | If the page contains a web-view component, the url of the current web-view is returned |

This event handler requires the return of an Object, which is used to customize the contents of the collection.

| Fields | Description | Default |
| - | - | - |
| title	| Customized Title | Page title or account name |
| imageUrl |Customize the image, displaying it with an aspect ratio of 1:1 | Page Screenshot |
| query | Custom query fields | Current page query |

#### Sample Code

```js title="page.js"
onAddToFavorites (res) {
  // webview  page return webviewUrl
  console.log('WebviewUrl: ', res.webviewUrl)
  return {
    title: 'custom title',
    imageUrl: 'http://demo.png',
    query: 'name=xxx&age=xxx',
  }
}
```

### onShareAppMessage (Object)

Listen to the user's behavior when they click on the forward button (Button component openType='share') or the "Forward" button in the top-right menu, and customize the forwarding content.

**Attention:**

1. When `onShareAppMessage` is not triggered, please set `enableShareAppMessage: true` in the page config
2. Only if this event handler is defined, the "Forward" button will be displayed in the upper right menu

#### Parameters

##### Object

| Parameters | Type | Description |
| - | - | - |
| from | String | Forwarding event sources <br />button: In-page forwarding buttons. <br />menu: Top right corner forwarding menu |
| target | Object |  If the `from` value is `button`, then `target` is the `button` that triggered the forwarding event, otherwise it is `undefined` |
| webViewUrl | String | Returns the url of the current `WebView` if the page contains a `WebView` component |

This event requires the return of an Object, which is used to customize the forwarding content, and returns the following:

Custom forwarding content

| Fields | Type | Description |
| - | - | - |
| title | Forwarding Title | Current mini-program name |
| path | Forwarding Title |  Current page path, must be a full path starting with / |
| imageUrl | Custom image path, either local file path, package file path or network image path. Support PNG and JPG. Display image aspect ratio is 5:4  | Use default screenshot |

#### Sample Code

```jsx title="page.js"
export default class Index extends Component {
  onShareAppMessage (res) {
    if (res.from === 'button') {
      // From the on-page forward button
      console.log(res.target)
    }
    return {
      title: 'Custom forwarding title',
      path: '/page/user?id=123'
    }
  }
}
```

```jsx title="page.config.js"
export default {
  // When `onShareAppMessage` is not triggered, you can try to configure this option
  enableShareAppMessage: true
}
```

### onShareTimeline ()

Listen to the behavior of the "Share to moments" button in the top-right menu and customize the sharing content.

> Taro version 3.0.3 and above support
> Only WeChat mini-program are supported, the base library 2.11.3 starts to support, this interface is a Beta version, only supported in Android platform for now

**Attention:**

1. When `onShareAppMessage` is not triggered, please set `enableShareAppMessage: true` in the page config
2. Only if this event handler is defined, the "Forward" button will be displayed in the upper right menu

#### Return Values

The event handler function can return an Object for customizing the shared content, does not support custom page paths, and returns the following content.

| Fields | Description | Defalut |
| - | - | - |
| title | Custom title | Current mini-program name |
| query | The parameters carried in the custom page path | The parameters carried in the current page path |
| imageUrl | Custom image path, can be local file or network image. Support PNG and JPG, display image aspect ratio is 1:1. | default use mini-program Logo  |

```jsx title="page.js"
class Index extends Component {
  onShareTimeline () {
    console.log('onShareTimeline')
    return {}
  }
}
```

```jsx title="page.config.js"
export default {
  enableShareTimeline: true
}
```

### onResize (Object)

Triggered when the mini-program screen is rotated. For details, see [Response to display area changes](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81)。

### onTabItemTap (Object)

Triggered when the tab is clicked.

#### Parameters

##### Object

| Parameters | Type | Description |
| - | - | - |
| index | String | The serial number of the clicked tabItem, starting from 0 |
| pagePath | String | The path to the page where the tabItem was clicked |
| text | String | The text of the clicked tabItem's button |

### onTitleClick ()

> Only Alipay Mini-program support

Click on the title to trigger

### onOptionMenuClick ()

> Only Alipay Mini-program support

Triggered by clicking on additional icons in the navigation bar

### onPopMenuClick ()

> Only Alipay Mini-program support

No description yet

### onPullIntercept ()

> Only Alipay Mini-program support

Triggered on dropdown truncation

## Built-in components

Taro is developed using built-in components of the mini-program specification, such as `<View />`, `<Text />`, `<Button />`, etc.

Before using these built-in components in React, they must be brought in from `@tarojs/components` and the component props follow the **Upper camelcase naming convention**.

Mini-program writing method:

```html
<view hover-class='test' />
```

Taro writing method:

```jsx
import { View } from '@tarojs/components'

<View hoverClass='test' />
```

## Events

Events in Taro follow the  lower camelcase naming convention, with all built-in event names starting with `on`.

In the event callback function, the first argument is the event itself, and calling `stopPropagation` in the callback will stop the bubbling.

```jsx
function Comp () {
  function clickHandler (e) {
    e.stopPropagation()
  }

  function scrollHandler () {}
  
  // The mini-program bindtap corresponds to Taro's onClick
  // The rest of the mini-program event names replace bind with on, which is the name of the Taro event (except for the Alipay mini-program, whose event starts with on)
  return <ScrollView onClick={clickHandler} onScroll={scrollHandler} />
}
```

### Taro 3 event system on the mini-program

In Taro 1 & 2, Taro determines whether the events bound in the applet template are in the form of `bind` or `catch` depending on whether the developer uses `e.stopPropagation()`. Thus event bubbling is controlled by the mini-program.

But in Taro 3, we have implemented a system of events in the mini-program logic layer, including event triggering and event bubbling. The events bound in the mini-program template are in the form of `bind`.

In general, this system of mini-program events implemented in the logic layer works properly, with event callbacks that trigger, bubble, and stop bubbling correctly.

However, the `catchtouchmove` event bound to the mini-program template prevents the callback function from bubbling through** in addition to preventing the view from **scrolling through**, something Taro's event system cannot do.

### Block rolling penetration

In the previous point, we introduced the event mechanism of Taro 3. Since events are bound as `bind`, you cannot use `e.stopPropagation()` to prevent scroll-through.

Two solutions are summarized for the problem of rolling penetration:

#### 一、Style

Use the style to solve. [Disable scrolling of penetrated components](https://github.com/NervJS/taro/issues/5984#issuecomment-614502302)。

This is also the most recommended practice.

#### 二、CatchMove

> Supported by Taro 3.0.21 and above

But the map component itself is scrollable, even if its width and height are fixed. So the first approach can't handle the scrolling events that bubble up to the map component.

This is the time to add the **catchMove** property to the `View` component.

```jsx
// This View component will bind the catchtouchmove event instead of bindtouchmove.
<View catchMove></View>
```

## Global Variables

When using React, global variables are recommended to be managed using a state management tool such as **React Redux**.

And sometimes some projects converting from native mini-program mount global variables to `app` and use `getApp()` to get them. Converting to the React ecosystem's way of managing state is more costly.

Therefore, you can use the `taroGlobalData` property of the entry object for compatibility with this writing style.

```jsx title="app.js"
class App extends Component {
  taroGlobalData = {
    x: 1
  }
  render () {
    return this.props.children
  }
}
```

```jsx title="index.js"
function Index () {
  const app = Taro.getApp()
  console.log(app.x)

  return (...)
}
```

## Hooks

[Hooks Document](./hooks.md)

## Other limitations

* Since mini-program do not support dynamic introduction, the `React.lazy` API cannot be used in mini-program.
* It is not possible to insert elements outside the DOM tree of a page component, so `<Portal>` is not supported.
* The `id` of all components must remain unique throughout the application (even if they are on different pages), otherwise it may cause problems with events not firing.[#7317](https://github.com/NervJS/taro/issues/7317)

## Frequently Asked Questions

* The render layer element information is not available in `useEffect`, `componentDidMount`.[7116](https://github.com/NervJS/taro/issues/7116)
* The latest width and height of the component is not available in `useEffect` or `useLayoutEffect`.[#7491](https://github.com/NervJS/taro/issues/7491)
* When the nesting level is deep, the child elements cannot be queried using `selectorQuery`.[#7411](https://github.com/NervJS/taro/issues/7411)
