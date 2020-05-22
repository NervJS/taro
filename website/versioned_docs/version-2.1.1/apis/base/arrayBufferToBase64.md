---
title: Taro.arrayBufferToBase64(buffer)
sidebar_label: arrayBufferToBase64
id: version-2.1.1-arrayBufferToBase64
original_id: arrayBufferToBase64
---

将 ArrayBuffer 数据转成 Base64 字符串。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.arrayBufferToBase64.html)

## 类型

```tsx
(buffer: ArrayBuffer) => string
```

## 参数

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>buffer</td>
      <td><code>ArrayBuffer</code></td>
      <td>要转换成 Base64 字符串的 ArrayBuffer 对象</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const arrayBuffer = new Uint8Array([11, 22, 33])
const base64 = Taro.arrayBufferToBase64(arrayBuffer)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.arrayBufferToBase64 | ✔️ | ✔️ |  |
