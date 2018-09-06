---
title: CoverView
sidebar_label: CoverView
---

##### 覆盖在原生组件之上的文本视图，可覆盖的原生组件包括map、video、canvas、camera、live-player、live-pusher，只支持嵌套cover-view、cover-image，可在cover-view中使用button。

> 组件 支持度

| 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: |
| ✔️ | x | x |

小程序全部支持，属性参考[cover-view](https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html)。属性值请改写为驼峰式命名。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 MovableArea, CoverView 组件
import { Video, CoverImage, CoverView } from '@tarojs/components'

class App extends Components {
	render () {
		return (
            <Video id='myVideo' src='src'>
                <CoverView class='controls'>
                    <CoverView class='play' onClick='play'>
                        <CoverImage class='img' src='src' />
                    </CoverView>
                </CoverView>
            </Video>
		)
	}
}
```
