---
title: Taro.offWindowResize(callback)
sidebar_label: offWindowResize
---

取消监听窗口尺寸变化事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.offWindowResize.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 窗口尺寸变化事件的回调函数 |

### Callback

窗口尺寸变化事件的回调函数

```tsx
(res: TaroGeneral.CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `TaroGeneral.CallbackResult` |
