---
title: Vue
---

Vue can be used in Taro via `import Vue from 'vue'`, but there are still some differences from using Vue in the browser, specifically.

## Entry Component

Every Taro application needs an entry component to register the application. The default entry file is `app.js` in the `src` directory.

To use Vue in Taro, the entry component must export a Vue component where we can set global state or access the lifecycle of the mini-program entry instance 

```jsx title="src/app.js"
import Vue from 'vue'
// Assuming we have configured the vuex in '. /store' is configured with vuex
import store from './store'

const App = {
  store,
  onShow (options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
}

export default App
```

> Note: Since Taro v3.1, the entry component has been written with Breaking Changes, see [3.1.0 Release Information] for details.(https://github.com/NervJS/taro/releases/tag/v3.1.0)。

For an entry file (e.g. `app.js`), we can add a new `app.config.js` file for global configuration. The default export of `app.config.js` is the mini-program's[global configuration](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html):

```js title="app.config.js"
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

### Lifecycle

#### onLaunch()

> This lifecycle method corresponds to the app's `onLaunch` in the WeChat/Baidu/ByteDance/Alipay mini-program.

Listening to program initialization, triggered when initialization is complete (only triggered once globally)

The program initialization parameters are accessible through `getCurrentInstance().router.params` during this lifecycle

The parameter format is as follows

| Proerty | Type |  Description | WeChat Mini-Program | Baidu Smart-Program | ByteDance Mini-Program | Alipay Mini-Program | H5 | React Native |
| - | - | - | - | - | - | - | - | - |
| path | string | Path to launch the mini-program | ✔️| ✔️| ✔️| ✔️|  ✘ |  ✘ |
| scene | number | Scene values to launch the mini-program | ✔️| ✔️| ✔️|  ✘ |  ✘ |  ✘ |
| query | Object | query parameter to launch the mini-program | ✔️| ✔️| ✔️| ✔️|  ✘ |  ✘ |
| shareTicket | string | shareTicket, See Get More Forwarding Information | ✔️| ✔️| ✔️|  ✘ |  ✘ | ✘ |
| referrerInfo | Object | Source information. Returned when accessing an applet from another applet, public number or app. Otherwise returns {} | ✔️| ✔️| ✔️| ✔️ |  ✘ | ✘ |

Among them, the scene value scene, there are differences in WeChat mini-program and Baidu smart-program, please refer to respectively  [WeChat mini-program documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) and [Baidu smart-program documentation](https://smartprogram.baidu.com/docs/data/scene/)

The data structure of the source referrerInfo is as follows

| Proerty | Type | Description | Wechat Mini-Program | Baidu Smart-Program | ByteDance Mini-Program | Alipay Mini-Program |
| - | - | - | - | - | - | - |
| appId | string | Source mini-program, or public number (in WeChat) | ✔️| ✔️| ✔️| ✔️|
| extraData | Object | The data passed from the source mini-program is supported by WeChat and Baidu smart-program at scene=1037 or 1038 | ✔️| ✔️| ✔️| ✔️|
| sourceServiceId | string | Source plugin, visible when in plugin run mode | ✘ | ✘ | ✘| ✔️(Base library version 1.11.0)|

#### created()

> This lifecycle method corresponds to the app's `onLaunch` in WeChat/Baidu/ByteDance/Alipay mini-program and is executed after `componentWillMount`.

Listening to program initialization, triggered when initialization is complete (only triggered once globally)


#### onShow()

> This lifecycle method corresponds to `onShow` in WeChat/Baidu/ByteDance/Alipay mini-program, and is implemented in H5/RN in parallel

It can be triggered when the program starts, or when it enters the foreground from the background, or you can use `Taro.onAppShow` to bind the listener in the WeChat  mini-program.

The program initialization parameters can be accessed during this lifecycle via `this.$router.params`

The parameters are basically the same as those obtained in `componentWillMount`, but the two additional parameters in **Baidu smart-program** are as follows

| Proerty | Type | Description | Lowest version |
| - | - | - | - |
| entryType | string | The source identifier of the exhibit, taking the value user/ schema /sys :<br />user：Indicates before and after passing home<br/>Switching or unlocking the screen, etc. to bring up.<br/>schema：Indicates that the protocol is called up;<br />sys：other | 2.10.7 |
| appURL | string | The call-up protocol at the time of the presentation, which exists only if the value of entryType is schema | 2.10.7 |

#### onHide()

> This lifecycle method corresponds to `onHide` in WeChat/Baidu/ByteDance/Alipay mini-program, and is implemented in H5/RN in parallel

The program is triggered when it enters the background from the foreground, you can also use `Taro.onAppHide` to bind the listener in the WeChat mini-program

#### onError(String error)

> This lifecycle method corresponds to `onHide` in WeChat/Baidu/ByteDance/Alipay mini-program, and is not yet implemented in H5/RN.

Triggered when a script error or API call error occurs, you can also use `Taro.onError` to bind the listener in the WeChat mini-program

#### onPageNotFound(Object)

> This lifecycle method corresponds to `onPageNotFound` in the WeChat/ByteDance mini-program, and is not yet implemented on other ends.<br/>
> In WeChat mini-program, the base library 1.9.90 starts to support

Triggered when the page to be opened does not exist, you can also use `Taro.onPageNotFound` to bind the listener in the WeChat mini-program

The parameters are as follows

| Proerty | Type | Description |
| - | - | - |
| path | string | Path to non-existent page |
| query | Object | Open the query parameter of a non-existent page |
| isEntryPage | boolean | Whether the first page of this launch (e.g. coming in from a portal such as sharing, the first page is the developer-configured sharing page) |

## Page Components

Every Taro application includes at least one page component that can jump through Taro routes and access the lifecycle of mini-program pages, and each page component must be a `.vue` file.

```html
<template>
  <view class="index">
    <NumberDisplay />
    <NumberSubmit />
  </view>
</template>

<script>
import NumberDisplay from '../../components/NumberDisplay.vue'
import NumberSubmit from '../../components/NumberSubmit.vue'

export default {
  name: 'Index',
  components: {
    NumberDisplay,
    NumberSubmit
  }
}
</script>

<style>
.index {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

### Page Configuration



As with the portal component, for a page file(e.g.`./pages/index/index.vue`), we can add a new `./pages/index/index.config.js` file for page configuration, `index.config.js` the default export of[page Configuration](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html),  Each page has its own configuration `config`, which is configured for the current page, and the configuration specification is based on the [page configuration](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE) of the WeChat mini-program, To develop and unify all platforms:

### Lifecycle

#### onReady()

This lifecycle corresponds to the `onReady` lifecycle of the applet page on the applet side. From this lifecycle, you can access the real DOM using APIs like `createCanvasContext` or `createselectorquery`.

In non-page components, you can use Taro's built-in [message mechanism](./apis/about/events) to access the `onReady()` lifecycle of a page component.


```vue
<template>
  <view id="only" />
</template>
<script>
  import { eventCenter, getCurrentInstance } from '@tarojs/taro'

  export default {
    mounted () {
      eventCenter.once(getCurrentInstance().router.onReady, () => {
        const query = Taro.createSelectorQuery()
        query.select('#only').boundingClientRect()
        query.exec(res => {
          console.log(res, 'res')
        })
        console.log('onReady')
      })
    }
  }
</script>
```

#### onLoad(options)

This lifecycle corresponds to the `onLoad` lifecycle of the applet page on the applet side. This lifecycle can be accessed from `getCurrentInstance().router`.

#### created()

Triggered on page load, a page will only be called once, when the page DOM is not ready and cannot yet interact with the view layer

#### mounted()

Triggered when the initial rendering of the page is complete, and will only be called once per page to indicate that the page is ready to interact with the view layer

#### beforeUpdate()

Page will be updated soon

#### updated(prevProps, prevState)

Page updated

#### beforeDestroy()

Triggered when a page is unloaded, such as when redirectTo or navigateBack to another page

#### onShow()

Triggered when the page is displayed/cut to the foreground

#### onHide()

Triggered when the page is hidden/cut to the background, such as navigateTo or bottom tab to other pages, applet cut to the background, etc.

**In all the above lifecycle methods, you can get the parameters in the path to open the current page with `getCurrentInstance().router`**.


### Page event handling functions

In the mini-program, the page also has in some exclusive event handling functions, as follows

#### onPullDownRefresh()

Listening for user drop-down refresh events

- You need to turn on enablePullDownRefresh in the window option of the global configuration or in the page configuration.
- The pull-down refresh can be triggered by [Taro.startPullDownRefresh](./apis/ui/pull-down-refresh/startPullDownRefresh), which triggers the pull-down refresh animation after the call, and the effect is the same as the user's manual pull-down refresh.
- When the data has been processed and refreshed, [Taro.stopPullDownRefresh](./apis/ui/pull-down-refresh/stopPullDownRefresh) You can stop the drop-down refresh of the current page.

#### onReachBottom()

Listen to the user pull-up bottom event

- You can set the trigger distance onReachBottomDistance in the window option of the global configuration or in the page configuration.
- This event will only be triggered once during the slide within the trigger distance

#### onPageScroll(Object)

Listening to user swipe page events

Object Parameters Description:

| Parameters | Type | Description |
| - | - | - |
| scrollTop | Number |  The distance the page has scrolled in the vertical direction (unit: px)|

**Note: Please define this method in the page only when needed and do not define empty methods. To reduce the impact of unnecessary event dispatching on rendering-logic layer communication. Note: Please avoid executing this.setState() too often in onPageScroll to cause logic-rendering layer communication. In particular, transferring a large amount of data at a time can affect communication time consumption.**

#### onShareAppMessage(Object)

Listen to the user's behavior when they click on the forward button (Button component openType='share') or the "Forward" button in the top-right menu, and customize the forwarding content.

Note: Only if this event handler is defined, the "Forward" button will be displayed in the upper right menu.

Object Parameters Description:

| Parameters | Type | Description |
| - | - | - |
| from | String | Forward the event source.<br />button：In-page forwarding buttons.<br />menu：Top right corner forwarding menu |
| target | Object | If the `from` value is `button`, then `target` is the `button` that triggered the forwarding event, otherwise it is `undefined` |
| webViewUrl | String | If the page contains a WebView component, the url of the current WebView is returned |

This event requires the return of an Object, which is used to customize the forwarding content, and returns the following.


Customized forwarding content

| Fields | Type | Description |
| - | - | - |
| title | Forwarding Title | Current mini-program name |
| path | Forwarding Title |  Current page path, must be a full path starting with / |
| imageUrl | Custom image path, either local file path, package file path or network image path. Support PNG and JPG. Display image aspect ratio is 5:4  | Use default screenshot |


Sample Code

```jsx
export default class Index extends Component {
  config = {
    navigationBarTitleText: 'Home'
  }

  onShareAppMessage (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: 'Custom forwarding title',
      path: '/page/user?id=123'
    }
  }

  render () {
    return (
      <View className='index'>
        <Text>1</Text>
      </View>
    )
  }
}
```

#### onResize(object)

> Only WeChat mini-program are supported<br />
> Base library 2.4.0 or higher support

Triggered when the mini-program screen is rotated. For details, see [Response to display area changes](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81).

#### onTabItemTap(Object)

> In WeChat mini-program, the base library 1.9.0 starts to support


Triggered when the tab is clicked.

Object Parameter Description :

| Parameters | Type | Description |
| - | - | - |
| index | String | The serial number of the clicked tabItem, starting from 0 |
| pagePath | String | The path to the page where the tabItem was clicked |
| text | String | The text of the clicked tabItem's button |

#### onAddToFavorites(Object)

> Supported by Taro 3.0.3 and above.
> Only supported by WeChat mini-program , this interface is Beta version, supported from Android version 7.0.15, only supported in Android platform for now.

Listen to the user's click on the "Favorites" button in the upper-right corner of the menu and customize the contents of the favorites.

Object Parameter Description :

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

```js
onAddToFavorites(res) {
  // webview  page return webviewUrl
  console.log('WebviewUrl: ', res.webviewUrl)
  return {
    title: 'custom title',
    imageUrl: 'http://demo.png',
    query: 'name=xxx&age=xxx',
  }
}
```

#### onShareTimeline()

> Taro version 3.0.3 and above support
> Only WeChat mini-program are supported, the base library 2.11.3 starts to support, this interface is a Beta version, only supported in Android platform for now

Listen to the behavior of the "Share to moments" button in the top-right menu and customize the sharing content.

**Note: Only if this event handler is defined, the "Share to Friends" button will be displayed in the upper right corner menu**

Customized forwarding content

The event handler function can return an Object for customizing the shared content, does not support custom page paths, and returns the following content.

| Fields | Description | Defalut |
| - | - | - |
| title | Custom title | Current mini-program name |
| query | The parameters carried in the custom page path | The parameters carried in the current page path |
| imageUrl | Custom image path, can be local file or network image. Support PNG and JPG, display image aspect ratio is 1:1. | default use mini-program Logo  |

#### componentWillPreload()

> Currently only WeChat mini-program are supported

[Preload](best-practice.md#Preload)

#### onTitleClick()

> Only supported by Alipay mini-program, supported by base library since 1.3.0

Click on the title to trigger

#### onOptionMenuClick()

> Only supported by Alipay mini-program, supported by base library since 1.3.0

Triggered by clicking on additional icons in the navigation bar

#### onPopMenuClick()

> Only supported by Alipay mini-program, supported by base library since 1.11.0

No description yet

#### onPullIntercept()

> Only supported by Alipay mini-program, supported by base library since 1.3.0

Triggered on dropdown truncation

> H5 does not synchronize `onReachBottom` and `onPageScroll` event functions for the time being, so you can simulate them by binding scroll events to the window, while `onPullDownRefresh` can only use the `ScrollView` component instead.

The degree of support for each end of the page event function is as follows

| Methods | Functions | Wechat Mini-Program | Baidu Smart-Program | ByteDance Mini-Program | Alipay Mini-Program | H5 | React Native |
| - | - | - | - | - | - | - | - |
| onPullDownRefresh | Page related event handling functions - listening to user drop-down actions | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onReachBottom | Handler function for the page pull-up bottoming event| ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onShareAppMessage | Users click on the top right corner to forward | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onPageScroll | Handling functions for page scrolling trigger events | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onTabItemTap | Triggered when tab is clicked when the current page is a tab | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onResize | Triggered when the page size changes, see [Response to display area changes](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81) | ✔️ | ✘|✘| ✘ |✘|✘|
| componentWillPreload | [Preload](best-practice.md#preload) | ✔️ | ✘|✘| ✘ |✘|✘|
| onTitleClick | Click on the title to trigger | ✘ | ✘|✘| ✔️|✘|✘|
| onOptionMenuClick | Triggered by clicking on additional icons in the navigation bar | ✘ | ✘|✘| ✔️（base library 1.3.0）|✘|✘|
| onPopMenuClick |  | ✘ | ✘|✘| ✔️（base library 1.3.0）|✘|✘|
| onPullIntercept | Triggered on dropdown truncation | ✘ | ✘|✘| ✔️（base library 1.11.0）|✘|✘|

The above member methods can also be used in Taro's pages by writing methods with the same name. However, it should be noted that only the applet side supports these methods for the time being (the support level is as above), and they will be invalid after compiling to the H5/RN side.


```js title="./pages/index/index.jsx"
export default {
  navigationBarTitleText: 'Home'
}
```

## Property Settings

Property settings follow the mini-program specification, using the  `Kebab Case`。

Note: Properties with `Boolean` values need to be explicitly bound to `true` and do not support abbreviations.

Example :

```html
<input type="text" placeholder-style="color: red" :focus="true"/>
```

## Built-in components

Using Vue in Taro, the built-in components follow the mini-program component specification, and the parameters of the components and the mini-program parameters are exactly the same.

## Events

Use the `@` modifier (or `v-on:`, see [Vue documentation](https://cn.vuejs.org/v2/guide/events.html)）instead of `bind` in applet events, and you can use `stopPropagation` in event handler functions to prevent event bubbling.

Note: In vue **click events** are bound using `@tap`.

Example :

```html
<template>
  <view>
    <input v-model="number" type="number" class="input" />
    <button @tap="addNumber">
      Add new number
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      number: 0
    }
  },
  methods: {
    addNumber(e) {
      e.stopPropagation()
    }
  }
}
</script>
```

## Compatible `<transition>`


The `<transition>` component uses `getComputedStyle` internally to sniff the animation style on the component. However, there is no way to implement `getComputedStyle` in the mini-program, it can be hacked in the following way.
The `<transition>` component uses `getComputedStyle` internally to sniff the animation style on the component. However, there is no way to implement `getComputedStyle` in the mini-program, it can be hacked in the following way.

Set `transitionDuration` or `animationDuration` to an element's `style` to specify the transition time to be compatible with `<transition>`.

```jsx
<transition>
  <view style="animationDuration: 0.5s" />
</transition>
```

## Other limitations

* Since mini-program access element positions as an asynchronous API, the built-in `transition-group` component cannot be used in mini-program.
* `<style scoped>` is not supported in the mini-program, it is recommended to use cssModules instead.[#6662](https://github.com/NervJS/taro/issues/6662)
* The `id` of all components must remain unique throughout the application (even if they are on different pages), otherwise it may cause problems with events not firing.[#7317](https://github.com/NervJS/taro/issues/7317)
