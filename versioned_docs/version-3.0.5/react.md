---
title: React
---

在 Taro 可以通过 `import * as React from 'react'` 来使用 React，JSX 语法没有任何限制，但和在浏览器中使用 React 依然有一些不同，具体体现在：

## 入口组件

每一个 Taro 应用都需要一个入口组件用来注册应用，入口文件默认是 `src` 目录下的 `app.js`，在 Taro 中使用 React，入口组件必须导出一个 React 组件，在入口组件中我们可以设置全局状态或访问小程序入口实例的生命周期：

```jsx
import React, { Component } from 'react'
// 假设我们要使用 Redux
import { Provider } from 'react-redux'

import configStore from './store'

import './app.css'

const store = configStore()

class App extends Component {
  componentDidMount () {}

  // 对应 onShow
  componentDidShow () {}

  // 对应 onHide
  componentDidHide () {}

  // 对应 onError
  componentDidCatchError () {}

  render () {
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    return (
      <Provider store={store}>
        {this.props.children} /* this.props.children 是将要被渲染的页面 */
      </Provider>
    )
  }
}

export default App
```

对于一个入口文件(例如`app.jsx`)而言，我们可以新增一个 `app.config.js` 的文件进行全局配置，`app.config.js` 的默认导出就是全局配置，配置规范基于微信小程序的[全局配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)进行制定，所有平台进行统一:

```js
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
```

### 组件生命周期

## onLaunch(options)

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 app 的 `onLaunch`

在此生命周期中通过 `getCurrentInstance().router.params`，可以访问到程序初始化参数。

#### componentWillMount()

监听程序初始化，初始化完成时触发（全局只触发一次）


参数格式如下

| 属性 | 类型 |  说明 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 | H5 | RN |
| - | - | - | - | - | - | - | - | - |
| path | string | 启动小程序的路径 | ✔️| ✔️| ✔️| ✔️|  ✘ |  ✘ |
| scene | number | 启动小程序的场景值 | ✔️| ✔️| ✔️|  ✘ |  ✘ |  ✘ |
| query | Object | 启动小程序的 query 参数 | ✔️| ✔️| ✔️| ✔️|  ✘ |  ✘ |
| shareTicket | string | shareTicket，详见获取更多转发信息 | ✔️| ✔️| ✔️|  ✘ |  ✘ | ✘ |
| referrerInfo | Object | 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {} | ✔️| ✔️| ✔️| ✔️ |  ✘ | ✘ |

其中，场景值 scene，在微信小程序和百度小程序中存在区别，请分别参考 [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) 和 [百度小程序文档](https://smartprogram.baidu.com/docs/data/scene/)

来源信息 referrerInfo 的数据结构如下

| 属性 | 类型 |  说明 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 |
| - | - | - | - | - | - | - |
| appId | string | 来源小程序，或者公众号（微信中） | ✔️| ✔️| ✔️| ✔️|
| extraData | Object | 来源小程序传过来的数据，微信和百度小程序在scene=1037或1038时支持 | ✔️| ✔️| ✔️| ✔️|
| sourceServiceId | string | 来源插件，当处于插件运行模式时可见 | ✘ | ✘ | ✘| ✔️（基础库版本 1.11.0）|

#### componentDidMount()

页面初次渲染完成时触发，一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。此生命周期可以无法访问 `getCurrentInstance().router`。此生命周期可以访问 Taro DOM 并且更改 DOM 或添加事件，但无法通过 `Taro.createSelectorQuery` 查找小程序 DOM。

#### componentDidShow(options)

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 `onShow`，在 H5/RN 中同步实现

程序启动，或从后台进入前台显示时触发，微信小程序中也可以使用 `Taro.onAppShow` 绑定监听

在此生命周期中通过 `getCurrentInstance().router.params`，可以访问到程序初始化参数。

参数与 `componentWillMount` 中获取的基本一致，但**百度小程序**中补充两个参数如下

| 属性 | 类型 |  说明 | 最低版本 |
| - | - | - | - |
| entryType | string | 展现的来源标识，取值为 user/ schema /sys :<br />user：表示通过home前后<br/>切换或解锁屏幕等方式调起；<br/>schema：表示通过协议调起;<br />sys：其它 | 2.10.7 |
| appURL | string | 展现时的调起协议，仅当entryType值为 schema 时存在| 2.10.7 |

#### componentDidHide()

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 `onHide`，在 H5/RN 中同步实现

程序从前台进入后台时触发，微信小程序中也可以使用 `Taro.onAppHide` 绑定监听

#### componentDidCatchError(String error)

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 `onError`，H5/RN 中尚未实现

程序发生脚本错误或 API 调用报错时触发，微信小程序中也可以使用 `Taro.onError` 绑定监听

#### componentDidNotFound(Object)

> 在微信/字节跳动小程序中这一生命周期方法对应 `onPageNotFound`，其他端尚未实现<br/>
> 微信小程序中，基础库 1.9.90 开始支持

程序要打开的页面不存在时触发，微信小程序中也可以使用 `Taro.onPageNotFound` 绑定监听

参数如下

| 属性 | 类型 |  说明 |
| - | - | - |
| path | string | 不存在页面的路径 |
| query | Object | 打开不存在页面的 query 参数 |
| isEntryPage | boolean | 是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面） |


## 页面组件

每一个 Taro 应用都至少包括一个页面组件，页面组件可以通过 Taro 路由进行跳转，也可以访问小程序页面的生命周期：

```jsx
import React, { Component } from 'react'
import { View, Button, Text } from '@tarojs/components'

class Index extends Component {

    config = {
    navigationBarTitleText: '首页'
  }

  // 对应 onShow
  componentDidShow () {}

  // 对应 onHide
  componentDidHide () {}

  // 对应 onPullDownRefresh，除了 componentDidShow/componentDidHide 之外，
  // 所有页面生命周期函数名都与小程序相对应
  onPullDownRefresh () {
  },

  // 对应 onPullDownRefresh
  onReachBottom () {
  },

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
      </View>
    )
  }
}

export default Index
```

### 配置文件
和入口组件一样，对于一个页面文件(例如`./pages/index/index.jsx`)而言，我们可以新增一个 `./pages/index/index.config.js` 的文件进行页面配置，`index.config.js` 的默认导出就是[页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html):

```js
// ./pages/index/index.jsx
export default {
  navigationBarTitleText: '首页'
}
```

### 生命周期

#### onReady()

页面首次渲染完毕时执行，此生命周期在小程序端对应小程序页面的 `onReady` 生命周期。从此生命周期开始可以使用 `createCanvasContext` 或 `createselectorquery` 等 API 访问真实 DOM。

在可以非页面组件中，可以使用 Taro 内置的 [消息机制](./apis/about/events) 访问页面组件的 `onReady()` 生命周期：

```jsx
import { eventCenter, getCurrentInstance } from '@tarojs/taro'
class Test extends React.Component {
  componentDidMount () {
    eventCenter.once(getCurrentInstance().router.onReady, () => {
      const query = Taro.createSelectorQuery()
      query.select('#only').boundingClientRect()
      query.exec(res => {
        console.log(res, 'res')
      })
      console.log('onReady')
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

#### onLoad(options)

页面创建时执行，此生命周期在小程序端对应小程序页面的 `onLoad` 生命周期。此生命周期可以访问 `getCurrentInstance().router`。

#### componentWillMount()

页面加载时触发，一个页面只会调用一次，此时页面 DOM 尚未准备好，还不能和视图层进行交互

#### componentDidMount()

页面初次渲染完成时触发，一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。此生命周期可以访问 `getCurrentInstance().router`。此生命周期可以访问 Taro DOM 并且更改 DOM 或添加事件，但无法通过 `Taro.createSelectorQuery` 查找小程序 DOM。

#### shouldComponentUpdate(nextProps, nextState)

页面是否需要更新，返回 false 不继续更新，否则继续走更新流程

#### componentWillUpdate(nextProps, nextState)

页面即将更新

#### componentDidUpdate(prevProps, prevState)

页面更新完毕

#### componentWillUnmount()

页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时

#### componentDidShow()

页面显示/切入前台时触发

#### componentDidHide()

页面隐藏/切入后台时触发， 如 navigateTo 或底部 tab 切换到其他页面，小程序切入后台等

**在以上所有的生命周期方法中，都可以通过 `getCurrentInstance().router.params` 获取打开当前页面路径中的参数**。

### 页面事件处理函数

在小程序中，页面还有在一些专属的事件处理函数，如下

#### onPullDownRefresh()

监听用户下拉刷新事件

- 需要在全局配置的 window 选项中或页面配置中开启 enablePullDownRefresh
- 可以通过 [Taro.startPullDownRefresh](./native-api.md#tarostartpulldownrefreshobject) 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
- 当处理完数据刷新后，[Taro.stopPullDownRefresh](./native-api.md#tarostoppulldownrefresh) 可以停止当前页面的下拉刷新

#### onReachBottom()

监听用户上拉触底事件

- 可以在全局配置的 window 选项中或页面配置中设置触发距离 onReachBottomDistance
- 在触发距离内滑动期间，本事件只会被触发一次

#### onPageScroll(Object)

监听用户滑动页面事件

Object 参数说明：

| 参数 | 类型 | 说明 |
| - | - | - |
| scrollTop | Number | 页面在垂直方向已滚动的距离（单位px）|

**注意：请只在需要的时候才在 page 中定义此方法，不要定义空方法。以减少不必要的事件派发对渲染层-逻辑层通信的影响。注意：请避免在 onPageScroll 中过于频繁的执行 this.setState() 等引起逻辑层-渲染层通信的操作。尤其是每次传输大量数据，会影响通信耗时。**

#### onShareAppMessage(Object)

监听用户点击页面内转发按钮（Button 组件 openType='share'）或右上角菜单“转发”按钮的行为，并自定义转发内容。

**注意：**

1. 只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮

Object 参数说明：

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

示例代码

```jsx
// page.js
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

#### onResize(Object)

> 只有微信小程序支持，基础库 2.4.0 开始支持

小程序屏幕旋转时触发。详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81)

#### onTabItemTap(Object)

> 微信小程序中，基础库 1.9.0 开始支持

点击 tab 时触发

Object 参数说明：

| 参数 | 类型 | 说明 |
| - | - | - |
| index | String | 被点击 tabItem 的序号，从 0 开始 |
| pagePath | String | 被点击 tabItem 的页面路径 |
| text | String | 被点击 tabItem 的按钮文字 |

#### onAddToFavorites(Object)

> Taro 3.0.3 版本开始支持
> 只有微信小程序支持，本接口为 Beta 版本，安卓 7.0.15 版本起支持，暂只在安卓平台支持

监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容。

Object 参数说明：

| 参数 | 类型 | 说明 |
| - | - | - |
| webviewUrl | String | 页面中包含web-view组件时，返回当前web-view的url |

此事件处理函数需要 return 一个 Object，用于自定义收藏内容：

| 字段 | 说明 | 默认值 |
| - | - | - |
| title	| 自定义标题 | 页面标题或账号名称 |
| imageUrl | 自定义图片，显示图片长宽比为 1：1 | 页面截图 |
| query | 自定义query字段 | 当前页面的query |

示例代码

```js
onAddToFavorites(res) {
  // webview 页面返回 webviewUrl
  console.log('WebviewUrl: ', res.webviewUrl)
  return {
    title: '自定义标题',
    imageUrl: 'http://demo.png',
    query: 'name=xxx&age=xxx',
  }
}
```

#### onShareTimeline()

> Taro 3.0.3 版本开始支持
> 只有微信小程序支持，基础库 2.11.3 开始支持，本接口为 Beta 版本，暂只在 Android 平台支持

监听右上角菜单“分享到朋友圈”按钮的行为，并自定义发享内容。

**注意：**

1. 只有定义了此事件处理函数，右上角菜单才会显示“分享到朋友圈”按钮

自定义转发内容

事件处理函数返回一个 Object，用于自定义分享内容，不支持自定义页面路径，返回内容如下：

| 字段 | 说明 | 默认值 |
| - | - | - |
| title	| 自定义标题 | 当前小程序名称 |
| query | 自定义页面路径中携带的参数 | 当前页面路径携带的参数 |
| imageUrl | 自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1。 | 默认使用小程序 Logo |

```jsx
// page.js
class Index extends Component {
  onShareTimeline () {
    console.log('onShareTimeline')
  }
}
```

#### componentWillPreload()

> 目前只有微信小程序支持

[预加载](best-practice.md#预加载)钩子

#### onTitleClick()

> 只有支付宝小程序支持，基础库 1.3.0 开始支持

点击标题触发

#### onOptionMenuClick()

> 只有支付宝小程序支持，基础库 1.3.0 开始支持

点击导航栏额外图标触发

#### onPopMenuClick()

> 只有支付宝小程序支持，基础库 1.11.0 开始支持

暂无说明

#### onPullIntercept()

> 只有支付宝小程序支持，基础库 1.3.0 开始支持

下拉截断时触发

> H5 暂时没有同步实现 `onReachBottom` 、 `onPageScroll` 这两个事件函数，可以通过给 window 绑定 scroll 事件来进行模拟，而 `onPullDownRefresh` 下拉刷新则暂时只能用 `ScrollView` 组件来代替了。

页面事件函数各端支持程度如下

| 方法 | 作用 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 | H5 | RN |
| - | - | - | - | - | - | - | - |
| onPullDownRefresh | 页面相关事件处理函数--监听用户下拉动作 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onReachBottom | 页面上拉触底事件的处理函数 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onShareAppMessage | 用户点击右上角转发 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onPageScroll | 页面滚动触发事件的处理函数 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onTabItemTap | 当前是 tab 页时，点击 tab 时触发 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onResize | 页面尺寸改变时触发，详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81) | ✔️ | ✘|✘| ✘ |✘|✘|
| componentWillPreload | [预加载](best-practice.md#预加载) | ✔️ | ✘|✘| ✘ |✘|✘|
| onTitleClick | 点击标题触发 | ✘ | ✘|✘| ✔️|✘|✘|
| onOptionMenuClick | 点击导航栏额外图标触发 | ✘ | ✘|✘| ✔️（基础库 1.3.0）|✘|✘|
| onPopMenuClick |  | ✘ | ✘|✘| ✔️（基础库 1.3.0）|✘|✘|
| onPullIntercept | 下拉截断时触发 | ✘ | ✘|✘| ✔️（基础库 1.11.0）|✘|✘|

以上成员方法在 Taro 的页面中同样可以使用，书写同名方法即可，不过需要注意的，目前暂时只有小程序端支持（支持程度如上）这些方法，编译到 H5/RN 端后这些方法均会失效。

## 内置组件/Props

Taro 中使用 React，内置组件遵循小程序组件规范，所有内置组件都必须从 `@tarojs/components` 引入，组件的 Props 遵从大驼峰式命名规范：

### Taro

```jsx
import { View } from '@tarojs/components'
<View hoverClass='test' />
```

对应小程序:

```html
<view hover-class='' />
```

## 事件

在 Taro 中事件遵从小驼峰式命名规范，所有内置事件名以 `on` 开头，在事件处理函数中第一个参数是事件本身，可以通过调用 `stopPropagation` 来阻止冒泡。

```jsx
function Comp () {
  // 只有 onClick 对应 bindtap
  // 其余内置事件名
  function clickHandler (e) {
    e.stopPropagation() // 阻止冒泡
  }

  function scrollHandler () {
    //
  }
  return <ScrollView onClick={clickHandler} onScroll={scrollHandler} />
}
```

## Hooks

[Hooks 文档](./hooks.md)

## 其它限制

由于小程序不支持动态引入，因此小程序中无法使用 `React.lazy` API。
