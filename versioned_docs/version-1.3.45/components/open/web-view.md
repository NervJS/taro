---
title: WebView
sidebar_label: WebView
---

##### WebView 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。个人类型与海外类型的小程序暂不支持使用

> 组件 支持度

| H5 | ReactNative |
| :-: | :-: |
| ✔ | ✔ |


>其他相关属性请看各小程序官方文档

[微信小程序 WebView](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)。

[百度小程序 WebView](https://smartprogram.baidu.com/docs/develop/component/open/#web-view)。

[支付宝小程序 WebView](https://docs.alipay.com/mini/component/web-view)。

[字节跳动小程序 WebView](https://developer.toutiao.com/docs/comp/web-view.html)。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 WebView 组件
import { WebView } from '@tarojs/components'

class App extends Component {
  render () {
    return (
      <WebView src='https://mp.weixin.qq.com/'  />
    )
  }
}
```
