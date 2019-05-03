---
title: 支付
sidebar_label: 支付
---

## Taro.faceVerifyForPay(OBJECT)

使用方式同 [`wx.faceVerifyForPay`](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.faceVerifyForPay.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.faceVerifyForPay(params).then(...)
```

## Taro.requestPayment(OBJECT)

使用方式同 [`wx.requestPayment`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.requestPayment.html)，h5端仅支持[微信公众号](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)（API以小程序为准），支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.requestPayment(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.faceVerifyForPay | ✔️ |  |  |
| Taro.requestPayment | ✔️ | ✔️ |  |
