---
title: Taro.base64ToArrayBuffer(base64)
sidebar_label: base64ToArrayBuffer
id: version-1.3.37-base64ToArrayBuffer
original_id: base64ToArrayBuffer
---

将 Base64 字符串转成 ArrayBuffer 数据。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.base64ToArrayBuffer.html)

## 类型

```tsx
(base64: string) => ArrayBuffer
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| base64 | `string` | 要转化成 ArrayBuffer 对象的 Base64 字符串 |

## 示例代码

```tsx
const base64 = 'CxYh'
const arrayBuffer = Taro.base64ToArrayBuffer(base64)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.base64ToArrayBuffer | ✔️ | ✔️ |  |
