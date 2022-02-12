---
title: Taro.createBufferURL(buffer)
sidebar_label: createBufferURL
---

根据传入的 buffer 创建一个唯一的 URL 存在内存中

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.createBufferURL.html)

## 类型

```tsx
(buffer: TypedArray | ArrayBuffer) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| buffer | TypedArray or ArrayBuffer | 需要存入内存的二进制数据 |
