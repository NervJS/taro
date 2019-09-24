---
title: Taro.createIntersectionObserver(Object component, Object options)
sidebar_label: createIntersectionObserver
id: version-1.3.19-createIntersectionObserver
original_id: createIntersectionObserver
---


使用方式同 [`wx.createIntersectionObserver`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createIntersectionObserver.html)。



**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const observer = Taro.createIntersectionObserver(this, { thresholds: [0], observeAll: true })
```

## API支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.createIntersectionObserver | ✔️ |  |  |

