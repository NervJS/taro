---
title: 用户信息
sidebar_label: 用户信息
---

## Taro.getUserInfo(OBJECT)

使用方式同 [`wx.getUserInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getUserInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getUserInfo(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getUserInfo | ✔️ |  |  |
