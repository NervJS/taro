---
title: 生物认证
sidebar_label: 生物认证
---

## Taro.checkIsSoterEnrolledInDevice(OBJECT)

使用方式同 [`wx.checkIsSoterEnrolledInDevice`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.checkIsSoterEnrolledInDevice.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.checkIsSoterEnrolledInDevice(params).then(...)
```

## Taro.checkIsSupportSoterAuthentication(OBJECT)

使用方式同 [`wx.checkIsSupportSoterAuthentication`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.checkIsSupportSoterAuthentication.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.checkIsSupportSoterAuthentication(params).then(...)
```

## Taro.startSoterAuthentication(OBJECT)

使用方式同 [`wx.startSoterAuthentication`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startSoterAuthentication.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startSoterAuthentication(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.checkIsSoterEnrolledInDevice | ✔️ |  |  |
| Taro.checkIsSupportSoterAuthentication | ✔️ |  |  |
| Taro.startSoterAuthentication | ✔️ |  |  |
