---
title: 获取位置
sidebar_label: 获取位置
---

## Taro.getLocation(OBJECT)

使用方式同 [`wx.getLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getLocation.html)，h5端仅支持[微信公众号]h5端仅支持[微信公众号](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)（API以小程序为准），支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getLocation(params).then(...)
```

## Taro.chooseLocation(OBJECT)

使用方式同 [`wx.chooseLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseLocation.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseLocation(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getLocation | ✔️ | ✔️ | ✔️ |
| Taro.chooseLocation | ✔️ | ✔️ |  |
