---
title: 登录
sidebar_label: 登录
---

## Taro.login(OBJECT)

使用方式同 [`wx.login`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.login.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.login(params).then(...)
```

## Taro.checkSession(OBJECT)

使用方式同 [`wx.checkSession`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.checkSession.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.checkSession(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.login | ✔️ |  |  |
| Taro.checkSession | ✔️ |  |  |
