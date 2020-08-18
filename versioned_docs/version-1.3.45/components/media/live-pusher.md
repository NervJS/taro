---
title: LivePusher
sidebar_label: LivePusher
---

##### 实时音视频录制

> 组件 支持度

| 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: |
| ✔️ | x | x |

小程序全部支持，属性参考[live-pusher](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html)。属性值请改写为驼峰式命名。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 LivePusher 组件
import { LivePusher } from '@tarojs/components'

class App extends Components {
  render () {
    return (
      <LivePusher url='url' mode='RTC' autopush  />
    )
  }
}
```
