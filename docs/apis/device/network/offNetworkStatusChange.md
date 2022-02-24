---
title: Taro.offNetworkStatusChange(callback)
sidebar_label: offNetworkStatusChange
---

取消监听网络状态变化事件，参数为空，则取消所有的事件监听。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.offNetworkStatusChange.html)

## 类型

```tsx
(callback?: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 取消监听网络状态变化事件，参数为空，则取消所有的事件监听 |
