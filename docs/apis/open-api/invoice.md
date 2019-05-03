---
title: 发票
sidebar_label: 发票
---

## Taro.chooseInvoice(OBJECT)

使用方式同 [`wx.chooseInvoice`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseInvoice.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseInvoice(params).then(...)
```

## Taro.chooseInvoiceTitle(OBJECT)

使用方式同 [`wx.chooseInvoiceTitle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseInvoiceTitle.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseInvoiceTitle(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.chooseInvoice | ✔️ |  |  |
| Taro.chooseInvoiceTitle | ✔️ |  |  |
