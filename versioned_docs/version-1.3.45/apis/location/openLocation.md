---
title: Taro.openLocation(OBJECT)
sidebar_label: openLocation
---

使用方式同 [`wx.openLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openLocation.html)，h5端仅支持[微信公众号](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)（API以小程序为准），支持 `Promise` 化使用。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.openLocation(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.openLocation | ✔️ | ✔️ |  |
