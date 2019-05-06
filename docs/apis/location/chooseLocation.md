---
title: Taro.chooseLocation(OBJECT)
sidebar_label: chooseLocation
---

使用方式同 [`wx.chooseLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseLocation.html)，支持 `Promise` 化使用。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.chooseLocation(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getLocation | ✔️ | ✔️ | ✔️ |
| Taro.chooseLocation | ✔️ | ✔️ |  |
