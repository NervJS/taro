---
title: Taro.onBLEPeripheralConnectionStateChanged(callback)
sidebar_label: onBLEPeripheralConnectionStateChanged
---

监听当前外围设备被连接或断开连接事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/wx.onBLEPeripheralConnectionStateChanged.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 监听当前外围设备被连接或断开连接事件 |

### Callback

当前外围设备被连接或断开连接事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| deviceId | `string` | 蓝牙设备 id |
| serverId | `string` | server 的 UUID |
| connected | `string` | 连接目前状态 |
