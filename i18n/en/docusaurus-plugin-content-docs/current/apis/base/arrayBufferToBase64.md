---
title: Taro.arrayBufferToBase64(buffer)
sidebar_label: arrayBufferToBase64
---

Converts an ArrayBuffer object to a Base64 string.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/wx.arrayBufferToBase64.html)

## Type

```tsx
(buffer: ArrayBuffer) => string
```

## Parameters

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>buffer</td>
      <td><code>ArrayBuffer</code></td>
      <td>The ArrayBuffer to be converted to a Base64 string</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const arrayBuffer = new Uint8Array([11, 22, 33])
const base64 = Taro.arrayBufferToBase64(arrayBuffer)
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.arrayBufferToBase64 | ✔️ | ✔️ | ✔️ |
