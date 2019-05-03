---
title: 剪贴板
sidebar_label: 剪贴板
---

## Taro.setClipboardData(OBJECT)

使用方式同 [`wx.setClipboardData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setClipboardData.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setClipboardData(params).then(...)
```

## Taro.getClipboardData(OBJECT)

使用方式同 [`wx.getClipboardData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getClipboardData.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getClipboardData(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setClipboardData | ✔️ | ✔️ | ✔️ |
| Taro.getClipboardData | ✔️ | ✔️ | ✔️ |
