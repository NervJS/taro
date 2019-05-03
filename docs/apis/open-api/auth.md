---
title: 授权
sidebar_label: 授权
---

## Taro.authorize(OBJECT)

使用方式同 [`wx.authorize`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.authorize.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.authorize(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.authorize | ✔️ |  |  |
