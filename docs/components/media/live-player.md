---
title: LivePlayer
sidebar_label: LivePlayer
---

##### 实时音视频播放

> 组件 支持度

| 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: |
| ✔️ | x | x |

小程序全部支持，属性参考[live-player](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)。属性值请改写为驼峰式命名。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 LivePlayer 组件
import { LivePlayer } from '@tarojs/components'

class App extends Components {
  render () {
    return (
      <LivePlayer src='url' mode='live' autoplay  />
    )
  }
}
```
