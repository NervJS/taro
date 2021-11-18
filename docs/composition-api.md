---
title: Vue3 Composition APIs
---

:::info
Taro v3.4.0+ 开始支持
:::

Vue3 提供了 [Composition API（组合式 API）](https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api) 特性，和传统的 Options API 不同，Composition API 提供了全新的编码方式 ，可以让我们更好地去组织和复用代码逻辑。

本文将会介绍 Taro 提供的一些**自定义 Composition APIs**。而关于 Composition API 的相关用法和内置 API 等信息，请参阅 Vue 文档：

- [介绍](https://v3.vuejs.org/guide/composition-api-introduction.html)
- [Setup 函数](https://v3.vuejs.org/guide/composition-api-setup.html)
- [生命周期](https://v3.vuejs.org/guide/composition-api-lifecycle-hooks.html)
- [Provider / Inject](https://v3.vuejs.org/guide/composition-api-provide-inject.html)
- [Template Refs](https://v3.vuejs.org/guide/composition-api-template-refs.html)
- [`<script setup>`](https://v3.vuejs.org/api/sfc-script-setup.html#basic-syntax)

## Taro Composition APIs

Taro 内置的一些 Composition API，可以从 `@tarojs/taro` 包中引入使用。

例子：

```html title="在 setup 函数中使用"
<script>
import { useDidShow } from '@tarojs/taro'

export default {
  setup () {
    useDidShow(() => console.log('onShow'))
  }
}
</script>
```

```html title="在 <script setup> 中使用"
<script setup>
import { useDidShow } from '@tarojs/taro'

useDidShow(() => console.log('onShow'))
</script>
```

### useRouter

等同于 `Taro.getCurrentInstance().router`。

```jsx title="示例代码"
// { path: '', params: { ... } }
const router = useRouter()
```

### useReady

等同于页面的 `onReady` 生命周期钩子。

从此生命周期开始可以使用 `createCanvasContext` 或 `createSelectorQuery` 等 API 访问小程序渲染层的 DOM 节点。

```js title="示例代码"
useReady(() => {
  const query = wx.createSelectorQuery()
})
```

### useDidShow

页面显示/切入前台时触发。等同于 `onShow` 页面生命周期钩子。

```jsx title="示例代码"
useDidShow(() => {
  console.log('onShow')
})
```

### useDidHide

页面隐藏/切入后台时触发。等同于 `onHide` 页面生命周期钩子。

```jsx title="示例代码"
useDidHide(() => {
  console.log('onHide')
})
```

### usePullDownRefresh

监听用户下拉动作。等同于 `onPullDownRefresh` 页面生命周期钩子。

```jsx title="示例代码"
usePullDownRefresh(() => {
  console.log('onPullDownRefresh')
})
```

### useReachBottom

监听用户上拉触底事件。等同于 `onReachBottom` 页面生命周期钩子。

```jsx title="示例代码"
useReachBottom(() => {
  console.log('onReachBottom')
})
```

### usePageScroll

监听用户滑动页面事件。等同于 `onPageScroll` 页面生命周期钩子。

```jsx title="示例代码"
usePageScroll(res => {
  console.log(res.scrollTop)
})
```

### useResize

小程序屏幕旋转时触发。等同于 `onResize` 页面生命周期钩子。

```jsx title="示例代码"
useResize(res => {
  console.log(res.size.windowWidth)
  console.log(res.size.windowHeight)
})
```

### useShareAppMessage

监听用户点击页面内转发按钮（Button 组件 openType='share'）或右上角菜单“转发”按钮的行为，并自定义转发内容。等同于 `onShareAppMessage` 页面生命周期钩子。

```jsx title="示例代码"
useShareAppMessage(res => {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target)
  }
  return {
    title: '自定义转发标题',
    path: '/page/user?id=123'
  }
})
```

### useTabItemTap

点击 tab 时触发。等同于 `onTabItemTap` 页面生命周期钩子。

```jsx title="示例代码"
useTabItemTap(item => {
  console.log(item.index)
  console.log(item.pagePath)
  console.log(item.text)
})
```

### useShareTimeline

监听右上角菜单“分享到朋友圈”按钮的行为，并自定义分享内容。等同于 `onShareTimeline` 页面生命周期钩子。

> 只有微信小程序支持，基础库 2.11.3 开始支持，本接口为 Beta 版本，暂只在 Android 平台支持

```jsx title="示例代码"
useShareTimeline(() => {
  console.log('onShareTimeline')
})
```

### useAddToFavorites

监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容。等同于 `onAddToFavorites` 页面生命周期钩子。

> 只有微信小程序支持，本接口为 Beta 版本，安卓 7.0.15 版本起支持，暂只在安卓平台支持

```jsx title="示例代码"
useAddToFavorites(res => {
  // webview 页面返回 webviewUrl
  console.log('WebviewUrl: ', res.webviewUrl)
  return {
    title: '自定义标题',
    imageUrl: 'https://demo.png',
    query: 'name=xxx&age=xxx',
  }
})
```

### useTitleClick

> 只有支付宝小程序支持。等同于 `onTitleClick` 页面生命周期钩子。

点击标题触发。

```jsx title="示例代码"
useTitleClick(() => console.log('onTitleClick'))
```

### useOptionMenuClick

> 只有支付宝小程序支持。等同于 `onOptionMenuClick` 页面生命周期钩子。

点击导航栏额外图标触发。

```jsx title="示例代码"
useOptionMenuClick(() => console.log('onOptionMenuClick'))
```

### usePullIntercept

> 只有支付宝小程序支持。等同于 `onPullIntercept` 页面生命周期钩子。

下拉截断时触发。

```jsx title="示例代码"
usePullIntercept(() => console.log('onPullIntercept'))
```
