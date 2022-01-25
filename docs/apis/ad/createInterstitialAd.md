---
title: Taro.createInterstitialAd(option)
sidebar_label: createInterstitialAd
---

创建插屏广告组件。
请通过 getSystemInfoSync 返回对象的 SDKVersion 判断基础库版本号后再使用该 API。每次调用该方法创建插屏广告都会返回一个全新的实例（小程序端的插屏广告实例不允许跨页面使用）。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/wx.createInterstitialAd.html)

## 类型

```tsx
(option: Option) => InterstitialAd
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| adUnitId | `string` | 广告单元 id |
