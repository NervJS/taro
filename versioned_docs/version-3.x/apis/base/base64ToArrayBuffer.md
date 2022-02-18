---
title: Taro.base64ToArrayBuffer(base64)
sidebar_label: base64ToArrayBuffer
---

将 Base64 字符串转成 ArrayBuffer 数据。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

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
