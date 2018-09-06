---
title: Map
sidebar_label: Map
---

##### 地图

> 组件 支持度

| 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: |
| ✔️ | x | x |

小程序全部支持，属性参考[地图](https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map)。属性值请改写为驼峰式命名。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 map 组件
import { Map } from '@tarojs/components'

class App extends Component {
	onTap () {}
	render () {
		return (
			<Map onClick={this.onTap} />
		)
	}
}
```
