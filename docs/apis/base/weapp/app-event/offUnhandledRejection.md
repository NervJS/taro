---
title: Taro.offUnhandledRejection(callback)
sidebar_label: offUnhandledRejection
---

取消监听未处理的 Promise 拒绝事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offUnhandledRejection.html)

## 类型

```tsx
<T = any>(callback: Callback<T>) => void
```

## 参数

| 参数 | 类型 |
| --- | --- |
| callback | `T` |
