---
title: WebView
sidebar_label: WebView
---

##### WebView 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。个人类型与海外类型的小程序暂不支持使用

> 组件 支持度

| 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: |
| ✔️ | x | x |

小程序全部支持，属性参考[web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)。属性值请改写为驼峰式命名。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 WebView 组件
import { WebView } from '@tarojs/components'

class App extends Components {
	render () {
		return (
			<WebView src='https://mp.weixin.qq.com/'  />
		)
	}
}
```
