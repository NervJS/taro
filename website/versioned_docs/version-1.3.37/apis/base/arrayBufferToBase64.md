---
title: Taro.arrayBufferToBase64(buffer)
sidebar_label: arrayBufferToBase64
id: version-1.3.37-arrayBufferToBase64
original_id: arrayBufferToBase64
---

将 ArrayBuffer 数据转成 Base64 字符串。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.arrayBufferToBase64.html)

## 类型

```tsx
(buffer: ArrayBuffer) => string
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| buffer | `ArrayBuffer` | 要转换成 Base64 字符串的 ArrayBuffer 对象 |

## 示例代码

```tsx
const arrayBuffer = new Uint8Array([11, 22, 33])
const base64 = Taro.arrayBufferToBase64(arrayBuffer)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.arrayBufferToBase64 | ✔️ | ✔️ |  |
