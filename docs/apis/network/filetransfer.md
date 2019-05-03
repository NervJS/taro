---
title: 上传、下载
sidebar_label: 上传、下载
---

## Taro.uploadFile(OBJECT)

使用方式同 [`wx.uploadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.uploadFile.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const uploadTask = Taro.uploadFile(params).then(...)
```

## Taro.downloadFile(OBJECT)

使用方式同 [`wx.downloadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.downloadFile.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.downloadFile(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.uploadFile | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Taro.downloadFile | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
