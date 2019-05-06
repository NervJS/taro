---
title: Taro.onCompassChange(CALLBACK)
sidebar_label: onCompassChange
---


使用方式同 [`wx.onCompassChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onCompassChange.html)。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.onCompassChange(res => {
  console.log(res.direction)
})
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onCompassChange | ✔️ | ✔️ |  |

