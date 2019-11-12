---
title: Taro.arrayBufferToBase64(buffer)
sidebar_label: arrayBufferToBase64
id: version-1.3.23-arrayBufferToBase64
original_id: arrayBufferToBase64
---

将 ArrayBuffer 数据转成 Base64 字符串。

## 类型

```tsx
(buffer: arrayBuffer) => string
```

## 示例代码

```tsx
const arrayBuffer = new Uint8Array([11, 22, 33])
const base64 = Taro.arrayBufferToBase64(arrayBuffer)
```
