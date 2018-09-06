---
title: OpenData
sidebar_label: OpenData
---

##### 用于展示微信开放的数据

> 组件 支持度

| 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: |
| ✔️ | x | x |

小程序全部支持，属性参考[open-data](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html)。属性值请改写为驼峰式命名。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 OpenData 组件
import { OpenData } from '@tarojs/components'

class App extends Components {
	render () {
		return (
			<OpenData type='userAvatarUrl'  />
		)
	}
}
```
