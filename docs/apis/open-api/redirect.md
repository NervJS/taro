---
title: 小程序跳转
sidebar_label: 小程序跳转
---

## Taro.navigateBackMiniProgram(OBJECT)

使用方式同 [`wx.navigateBackMiniProgram`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateBackMiniProgram.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.navigateBackMiniProgram(params).then(...)
```

## Taro.navigateToMiniProgram(OBJECT)

使用方式同 [`wx.navigateToMiniProgram`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateToMiniProgram.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.navigateToMiniProgram(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.navigateBackMiniProgram | ✔️ |  |  |
| Taro.navigateToMiniProgram | ✔️ |  |  |
