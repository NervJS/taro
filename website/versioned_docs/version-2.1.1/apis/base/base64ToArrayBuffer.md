---
title: Taro.base64ToArrayBuffer(base64)
sidebar_label: base64ToArrayBuffer
id: version-2.1.1-base64ToArrayBuffer
original_id: base64ToArrayBuffer
---

将 Base64 字符串转成 ArrayBuffer 数据。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.base64ToArrayBuffer.html)

## 类型

```tsx
(base64: string) => ArrayBuffer
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
      <td>base64</td>
      <td><code>string</code></td>
      <td>要转化成 ArrayBuffer 对象的 Base64 字符串</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const base64 = 'CxYh'
const arrayBuffer = Taro.base64ToArrayBuffer(base64)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.base64ToArrayBuffer | ✔️ | ✔️ |  |
