---
title: Taro.offUserCaptureScreen(callback)
sidebar_label: offUserCaptureScreen
---

用户主动截屏事件。取消事件监听。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.offUserCaptureScreen.html)

## 类型

```tsx
(callback: (...args: any[]) => any) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(...args: any[]) => any` | 用户主动截屏事件的回调函数 |
