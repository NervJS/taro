---
title: 振动
sidebar_label: 振动
---

## Taro.vibrateLong(OBJECT)

使用方式同 [`wx.vibrateLong`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.vibrateLong.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.vibrateLong(params).then(...)
```

## Taro.vibrateShort(OBJECT)

使用方式同 [`wx.vibrateShort`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.vibrateShort.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.vibrateShort(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.vibrateLong | ✔️ | ✔️ | ✔️ |
| Taro.vibrateShort | ✔️ | ✔️ | ✔️ |
