---
title: Taro.createAnimation(OBJECT)
sidebar_label: createAnimation
---


使用方式同 [`wx.createAnimation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createAnimation.html)。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

const animation = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.createAnimation | ✔️ | ✔️ |  |

