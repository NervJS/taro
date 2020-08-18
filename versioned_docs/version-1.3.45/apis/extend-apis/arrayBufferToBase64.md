---
title: arrayBufferToBase64
sidebar_label: arrayBufferToBase64
---

## Taro.arrayBufferToBase64(arrayBuffer)

将 ArrayBuffer 数据转成 Base64 字符串。(小程序端基础库 1.1.0 开始支持，低版本需做兼容处理)

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const arrayBuffer = new Uint8Array([11, 22, 33])
const base64 = Taro.arrayBufferToBase64(arrayBuffer)
```
