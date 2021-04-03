---
title: React
---

Taro 支持使用 React 进行开发，但和在浏览器中使用 React 稍有不同，具体体现在：

## 入口组件

每一个 Taro 应用都需要一个入口组件用来注册应用，入口文件默认是 `src` 目录下的 `app.js`。

在 Taro 中使用 React，入口组件必须导出一个 React 组件。在入口组件中我们可以设置全局状态或访问小程序入口实例的生命周期：

```jsx title="app.js"
import React, { Component } from 'react'

// 假设我们要使用 Redux
import { Provider } from 'react-redux'
import configStore from './store'

// 全局样式
import './app.css'

const store = configStore()

class App extends Component {
  // 可以使用所有的 React 组件方法
  componentDidMount () {}

  // 对应 onLaunch
  onLaunch () {}

  // 对应 onShow
  componentDidShow () {}

  // 对应 onHide
  componentDidHide () {}

  render () {
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    return (
      <Provider store={store}>
        /* this.props.children 是将要被渲染的页面 */
        {this.props.children}
      </Provider>
    )
  }
}

export default App
```

### 入口配置

我们可以新增一个 `app.config.js` 文件进行全局配置，`app.config.js` 的默认导出就是全局配置。

配置规范基于微信小程序的[全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)进行制定，所有平台进行统一:

```js  title="app.config.js"
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
```

注意：

1. `app.config.js` 里 require 或 import 引用的 js 文件目前**没有经过 Babel 编译语法**。
2. 多端差异化逻辑可以使用 `process.env.TARO_ENV` 变量作条件判断以实现。

### onLaunch (options)

> 在小程序环境中对应 app 的 `onLaunch`。

在此生命周期中通过访问 `options` 参数或调用 `getCurrentInstance().router`，可以访问到程序初始化参数。

#### 参数

##### options

| 属性 | 类型 |  说明 |
| - | - | - |
| path | string | 启动小程序的路径 |
| scene | number | 启动小程序的场景值 |
| query | Object | 启动小程序的 query 参数 |
| shareTicket | string | shareTicket，详见获取更多转发信息 |
| referrerInfo | Object | 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {} |


##### options.referrerInfo

| 属性 | 类型 |  说明 |
| - | - | - |
| appId | string | 来源小程序，或者公众号（微信中） |
| extraData | Object | 来源小程序传过来的数据，微信和百度小程序在scene=1037或1038时支持 |
| sourceServiceId | string | 来源插件，当处于插件运行模式时可见 |

> options 参数的字段在不同小程序中可能存在差异，如：
>
> 场景值 scene，在微信小程序和百度小程序中存在区别，请分别参考 [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) 和 [百度小程序文档](https://smartprogram.baidu.com/docs/data/scene/)

### componentDidShow (options)

程序启动，或切前台时触发。

和 `onLaunch` 生命周期一样，在此生命周期中通过访问 `options` 参数或调用 `getCurrentInstance().router`，可以访问到程序初始化参数。

参数与 `onLaunch` 中获取的基本一致，但**百度小程序**中补充两个参数如下：

| 属性 | 类型 |  说明 |
| - | - | - |
| entryType | string | 展现的来源标识，取值为 user/ schema /sys :<br />user：表示通过home前后<br/>切换或解锁屏幕等方式调起；<br/>schema：表示通过协议调起;<br />sys：其它 |
| appURL | string | 展现时的调起协议，仅当entryType值为 schema 时存在|

### componentDidHide ()

程序切后台时触发。

### onPageNotFound (Object)

程序要打开的页面不存在时触发。

#### 参数
##### Object

| 属性 | 类型 |  说明 |
| - | - | - |
| path | string | 不存在页面的路径 |
| query | Object | 打开不存在页面的 query 参数 |
| isEntryPage | boolean | 是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面） |


## 页面组件

每一个 Taro 应用都至少包括一个页面组件，页面组件可以通过 Taro 路由进行跳转，也可以访问小程序页面的生命周期。

```jsx title="Class Component"
import React, { Component } from 'react'
import { View } from '@tarojs/components'

class Index extends Component {
  // 可以使用所有的 React 组件方法
  componentDidMount () {}

  // onLoad
  onLoad () {}

  // onReady
  onReady () {}

  // 对应 onShow
  componentDidShow () {}

  // 对应 onHide
  componentDidHide () {}

  // 对应 onPullDownRefresh，除了 componentDidShow/componentDidHide 之外，
  // 所有页面生命周期函数名都与小程序相对应
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
  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onReady
  useReady(() => {})

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  // Taro 对所有小程序页面生命周期都实现了对应的自定义 React Hooks 进行支持
  // 详情可查阅：【Taro 文档】-> 【进阶指南】->【Hooks】
  usePullDownRefresh(() => {})

  return (
    <View className='index' />
  )
}

export default Index
```

### 页面配置

对于每一个页面文件(例如 `./pages/index/index.jsx`)，我们可以新增一个 `./pages/index/index.config.js` 的文件进行页面配置，`index.config.js` 的默认导出就是页面配置。

配置规范基于微信小程序的[页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)进行制定，所有平台进行统一:


```js title="./pages/index/index.config.js"
export default {
  navigationBarTitleText: '首页'
}
```

注意：

1. `app.config.js` 里 require 或 import 引用的 js 文件目前**没有经过 Babel 编译语法**。
2. 多端差异化逻辑可以使用 `process.env.TARO_ENV` 变量作条件判断以实现。

### 路由参数

在页面组件中，可以通过 `getCurrentInstance().router` 获取当前页面的路由参数：

```jsx
import React, { Component } from 'react'
import { View } from '@tarojs/components'

class Index extends Component {
  // 建议在页面初始化时把 getCurrentInstance() 的结果保存下来供后面使用，
  // 而不是频繁地调用此 API
  $instance = getCurrentInstance()

  componentDidMount () {
    // 获取路由参数
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

### 生命周期触发机制

Taro 3 在小程序逻辑层上实现了一份遵循 Web 标准 BOM 和 DOM API。因此 React 使用的 `document.appendChild`、`document.removeChild` 等 API 其实是 Taro 模拟实现的，最终的效果是把 React 的虚拟 DOM 树渲染为 Taro 模拟的 Web 标准 DOM 树。

因此在 Taro3 中，React 的生命周期触发时机和我们平常在 Web 开发中理解的概念有一些偏差。

#### React 的生命周期

React 组件的生命周期方法在 Taro 中都支持使用。

触发时机：

##### 1. componentWillMount ()

[onLoad](./react#onload-options) 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发。

##### 2. componentDidMount ()

页面组件渲染到 Taro 的虚拟 DOM 之后触发。

此时能访问到 Taro 的虚拟 DOM（使用 React ref、document.getElementById 等手段），并支持对其进行操作（设置 DOM 的 style 等）。

但此时不代表 Taro 的虚拟 DOM 数据已经完成从逻辑层 `setData` 到视图层。因此这时**无法通过 `createSelectorQuery` 等方法获取小程序渲染层 DOM 节点。** 只能在 [onReady](./react#onready-) 生命周期中获取。

#### 小程序页面的方法

小程序页面的方法，在 Taro 的页面中同样可以使用：在 Class Component 中书写同名方法、在 Functional Component 中使用对应的 Hooks。

**注意：**

* 小程序页面方法在各端的支持程度不一。
* 使用了 HOC 包裹的小程序页面组件，必须处理 forwardRef 或使用继承组件的方式而不是返回组件的方式，否则小程序页面方法可能不会被触发。

### onLoad (options)

> 在小程序环境中对应页面的 `onLoad`。

在此生命周期中通过访问 `options` 参数或调用 `getCurrentInstance().router`，可以访问到页面路由参数。

### onReady ()

> 在小程序环境中对应页面的 `onReady`。

从此生命周期开始可以使用 `createCanvasContext` 或 `createSelectorQuery` 等 API 访问小程序渲染层的 DOM 节点。

#### 子组件的 onReady

只在页面组件才会触发 `onReady` 生命周期。子组件可以使用 Taro 内置的[消息机制](./apis/about/events)监听页面组件的 `onReady()` 生命周期：

```jsx title="页面中某个子组件"
import React from 'react'
import { View } from '@tarojs/components'
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro'

class Test extends React.Component {
  $instance = getCurrentInstance()

  componentWillMount () {
    const onReadyEventId = this.$instance.router.onReady
    eventCenter.once(onReadyEventId, () => {
      console.log('onReady')

      // onReady 触发后才能获取小程序渲染层的节点
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

但是当子组件是**按需加载**的时候，页面 `onReady` 早已触发。如果此按需加载的子组件需要获取小程序渲染层的 DOM 节点，因为错过了页面 `onReady`，只能尝试使用 `Taro.nextTick` 模拟：

```jsx title="按需加载的子组件"
import React from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

class Test extends React.Component {
  componentDidMount () {
    Taro.nextTick(() => {
      // 使用 Taro.nextTick 模拟 setData 已结束，节点已完成渲染
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

> 在小程序环境中对应页面的 `onShow`。

页面显示/切入前台时触发。

#### 子组件的 onShow

只在页面组件才会触发 `onShow` 生命周期。子组件可以使用 Taro 内置的[消息机制](./apis/about/events)监听页面组件的 `onShow()` 生命周期：

```jsx title="页面中某个子组件"
import React from 'react'
import { View } from '@tarojs/components'
import { eventCenter, getCurrentInstance } from '@tarojs/taro'

class Test extends React.Component {
  $instance = getCurrentInstance()

  componentWillMount () {
    const onShowEventId = this.$instance.router.onShow
    // 监听
    eventCenter.on(onShowEventId, this.onShow)
  }

  componentWillUnmount () {
    const onShowEventId = this.$instance.router.onShow
    // 卸载
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

> 在小程序环境中对应页面的 `onHide`。

页面隐藏/切入后台时触发。

#### 子组件的 onHide

只在页面组件才会触发 `onHide` 生命周期。子组件可以使用 Taro 内置的[消息机制](./apis/about/events)监听页面组件的 `onHide()` 生命周期：

```jsx title="页面中某个子组件"
import React from 'react'
import { View } from '@tarojs/components'
import { eventCenter, getCurrentInstance } from '@tarojs/taro'

class Test extends React.Component {
  $instance = getCurrentInstance()

  componentWillMount () {
    const onHideEventId = this.$instance.router.onHide
    // 监听
    eventCenter.on(onHideEventId, this.onHide)
  }

  componentWillUnmount () {
    const onHideEventId = this.$instance.router.onHide
    // 卸载
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

监听用户下拉动作。

- 需要在全局配置的 window 选项中或页面配置中设置 `enablePullDownRefresh: true`。
- 可以通过 [Taro.startPullDownRefresh](./apis/ui/pull-down-refresh/startPullDownRefresh.md) 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
- 当处理完数据刷新后，[Taro.stopPullDownRefresh](./apis/ui/pull-down-refresh/stopPullDownRefresh.md) 可以停止当前页面的下拉刷新.

### onReachBottom ()

监听用户上拉触底事件。

- 可以在全局配置的 window 选项中或页面配置中设置触发距离 `onReachBottomDistance`。
- 在触发距离内滑动期间，本事件只会被触发一次

> H5 暂时没有同步实现，可以通过给 window 绑定 scroll 事件来进行模拟

### onPageScroll (Object)

监听用户滑动页面事件。

> H5 暂时没有同步实现，可以通过给 window 绑定 scroll 事件来进行模拟

#### 参数

##### Object

| 参数 | 类型 | 说明 |
| - | - | - |
| scrollTop | Number | 页面在垂直方向已滚动的距离（单位px）|


### onAddToFavorites (Object)

监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容。

> Taro 3.0.3 版本开始支持。
> 只有微信小程序支持，本接口为 Beta 版本，安卓 7.0.15 版本起支持，暂只在安卓平台支持。

#### 参数

##### Object

| 参数 | 类型 | 说明 |
| - | - | - |
| webviewUrl | String | 页面中包含web-view组件时，返回当前web-view的url |

此事件处理函数需要 return 一个 Object，用于自定义收藏内容：

| 字段 | 说明 | 默认值 |
| - | - | - |
| title	| 自定义标题 | 页面标题或账号名称 |
| imageUrl | 自定义图片，显示图片长宽比为 1：1 | 页面截图 |
| query | 自定义query字段 | 当前页面的query |

#### 示例代码

```js title="page.js"
onAddToFavorites (res) {
  // webview 页面返回 webviewUrl
  console.log('WebviewUrl: ', res.webviewUrl)
  return {
    title: '自定义标题',
    imageUrl: 'http://demo.png',
    query: 'name=xxx&age=xxx',
  }
}
```

### onShareAppMessage (Object)

监听用户点击页面内转发按钮（Button 组件 openType='share'）或右上角菜单“转发”按钮的行为，并自定义转发内容。

**注意：**

1. 当 `onShareAppMessage` 没有触发时，请在页面配置中设置 `enableShareAppMessage: true`
2. 只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮

#### 参数

##### Object

| 参数 | 类型 | 说明 |
| - | - | - |
| from | String | 转发事件来源。<br />button：页面内转发按钮；<br />menu：右上角转发菜单 |
| target | Object | 如果 `from` 值是 `button`，则 `target` 是触发这次转发事件的 `button`，否则为 `undefined` |
| webViewUrl | String | 页面中包含 `WebView` 组件时，返回当前 `WebView` 的url |

此事件需要 return 一个 Object，用于自定义转发内容，返回内容如下：

自定义转发内容

| 字段 | 类型 | 说明 |
| - | - | - |
| title | 转发标题 | 当前小程序名称 |
| path | 转发路径 | 当前页面 path ，必须是以 / 开头的完整路径 |
| imageUrl | 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及 JPG 。显示图片长宽比是 5:4 | 使用默认截图 |

#### 示例代码

```jsx title="page.js"
export default class Index extends Component {
  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }
}
```

```jsx title="page.config.js"
export default {
  // 当 `onShareAppMessage` 没有触发时，可以尝试配置此选项
  enableShareAppMessage: true
}
```

### onShareTimeline ()

监听右上角菜单“分享到朋友圈”按钮的行为，并自定义分享内容。

> Taro 3.0.3 版本开始支持
> 只有微信小程序支持，基础库 2.11.3 开始支持，本接口为 Beta 版本，暂只在 Android 平台支持

**注意：**

1. 当 `onShareTimeline` 没有触发时，请在页面配置中设置 `enableShareTimeline: true`
2. 只有定义了此事件处理函数，右上角菜单才会显示“分享到朋友圈”按钮

#### 返回值

事件处理函数可以返回一个 Object，用于自定义分享内容，不支持自定义页面路径，返回内容如下：

| 字段 | 说明 | 默认值 |
| - | - | - |
| title	| 自定义标题 | 当前小程序名称 |
| query | 自定义页面路径中携带的参数 | 当前页面路径携带的参数 |
| imageUrl | 自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1。 | 默认使用小程序 Logo |

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
  // 当 `onShareAppMessage` 没有触发时，可以尝试配置此选项
  enableShareTimeline: true
}
```

### onResize (Object)

小程序屏幕旋转时触发。详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81)。

### onTabItemTap (Object)

点击 tab 时触发。

#### 参数

##### Object

| 参数 | 类型 | 说明 |
| - | - | - |
| index | String | 被点击 tabItem 的序号，从 0 开始 |
| pagePath | String | 被点击 tabItem 的页面路径 |
| text | String | 被点击 tabItem 的按钮文字 |

### onTitleClick ()

> 只有支付宝小程序支持

点击标题触发

### onOptionMenuClick ()

> 只有支付宝小程序支持

点击导航栏额外图标触发

### onPopMenuClick ()

> 只有支付宝小程序支持

暂无说明

### onPullIntercept ()

> 只有支付宝小程序支持

下拉截断时触发

## 内置组件

Taro 中使用小程序规范的内置组件进行开发，如 `<View />`、`<Text />`、`<Button />` 等。

在 React 中使用这些内置组件前，必须从 `@tarojs/components` 进行引入，组件的 props 遵从**大驼峰式命名规范**：

小程序写法:

```html
<view hover-class='test' />
```

对应 Taro 的写法：

```jsx
import { View } from '@tarojs/components'

<View hoverClass='test' />
```

## 事件

在 Taro 中事件遵从小驼峰式（camelCase）命名规范，所有内置事件名以 `on` 开头。

在事件回调函数中，第一个参数是事件本身，回调中调用 `stopPropagation` 可以阻止冒泡。

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

## 全局变量

在使用 React 时，全局变量推荐使用 **React Redux** 等状态管理工具进行管理。

而有时候一些从原生小程序转换过来的项目，会把全局变量挂载到 `app` 上，然后使用 `getApp()` 获取它们。改造为 React 生态的状态管理方式成本比较大。

因此可以使用入口对象的 `taroGlobalData` 属性对这种写法进行兼容：

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

[Hooks 文档](./hooks.md)

## 其它限制

* 由于小程序不支持动态引入，因此小程序中无法使用 `React.lazy` API。
* 所有组件的 `id` 必须在整个应用中保持唯一（即使他们在不同的页面），否则可能导致事件不触发的问题，[#7317](https://github.com/NervJS/taro/issues/7317)

## 常见问题

* `useEffect`、`componentDidMount` 中获取不到渲染层元素信息，[7116](https://github.com/NervJS/taro/issues/7116)
* `useEffect` 或 `useLayoutEffect` 中获取不到组件最新的宽高，[#7491](https://github.com/NervJS/taro/issues/7491)
* 嵌套层级较深时，使用 `selectorQuery` 无法查询到子元素，[#7411](https://github.com/NervJS/taro/issues/7411)
