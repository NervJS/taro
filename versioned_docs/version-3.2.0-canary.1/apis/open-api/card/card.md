---
title: 卡券
sidebar_label: 卡券
---

## Taro.addCard(OBJECT)

使用方式同 [`wx.addCard`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.addCard.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.addCard(params).then(...)
```

## Taro.openCard(OBJECT)

使用方式同 [`wx.openCard`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openCard.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openCard(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.addCard | ✔️ |  |  |
| Taro.openCard | ✔️ |  |  |
