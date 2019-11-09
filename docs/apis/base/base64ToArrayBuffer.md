---
title: Taro.base64ToArrayBuffer(base64)
sidebar_label: base64ToArrayBuffer
---

将 Base64 字符串转成 ArrayBuffer 数据。

## 类型

```tsx
(base64: string) => arrayBuffer
```

## 示例代码

```tsx
const base64 = 'CxYh'
const arrayBuffer = Taro.base64ToArrayBuffer(base64)
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.base64ToArrayBuffer | ✔️ |  |  |  |  | ✔️ |  |  |
