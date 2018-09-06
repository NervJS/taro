---
title: MovableView
sidebar_label: MovableView
---

##### 可移动的视图容器，在页面中可以拖拽滑动

> 组件 支持度

| 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: |
| ✔️ | x | x |

小程序全部支持，属性参考[movable-view](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html)。属性值请改写为驼峰式命名。


```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 MovableArea, MovableView 组件
import { MovableArea, MovableView } from '@tarojs/components'

class App extends Components {
	render () {
		return (
			  <MovableArea style='height: 200px; width: 200px; background: red;'>
                            <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'></MovableView>
                            </MovableArea>
		)
	}
}
```
