---
title: Taro.revokeBufferURL(url)
sidebar_label: revokeBufferURL
---

根据 URL 销毁存在内存中的数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.revokeBufferURL.html)

## 类型

```tsx
(url: string) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| url | `string` | 需要销毁的二进制数据 URL |
