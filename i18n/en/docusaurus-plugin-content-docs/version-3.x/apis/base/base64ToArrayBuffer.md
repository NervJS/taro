---
title: Taro.base64ToArrayBuffer(base64)
sidebar_label: base64ToArrayBuffer
---

Converts a Base64 string to an ArrayBuffer object.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/wx.base64ToArrayBuffer.html)

## Type

```tsx
(base64: string) => ArrayBuffer
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
      <td>base64</td>
      <td><code>string</code></td>
      <td>The Base64 string to be converted to an ArrayBuffer object</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const base64 = 'CxYh'
const arrayBuffer = Taro.base64ToArrayBuffer(base64)
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.base64ToArrayBuffer | ✔️ | ✔️ | ✔️ |
