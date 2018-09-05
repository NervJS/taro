---
title: Canvas
sidebar_label: Canvas
---

##### 画布

> 组件 支持度

| 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: |
| ✔️ | x | x |

小程序全部支持，属性参考[canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html#canvas)。属性值请改写为驼峰式命名。

```javascript
import Taro, { Component } from '@tarojs/taro'
// 引入 Canvas 组件
import { Canvas } from '@tarojs/components'

class App extends Components {
	render () {
		return (
			<Canvas style='width: 300px; height: 200px;' canvas-id='canvas' />
		)
	}
}
```
