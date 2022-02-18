---
title: Taro.arrayBufferToBase64(buffer)
sidebar_label: arrayBufferToBase64
---

将 ArrayBuffer 数据转成 Base64 字符串。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

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
