---
title: Taro.onBLEMTUChange(callback)
sidebar_label: onBLEMTUChange
---

监听蓝牙低功耗的最大传输单元变化事件（仅安卓触发）

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLEMTUChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 蓝牙低功耗的最大传输单元变化事件的回调函数 |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| deviceId | `string` | 蓝牙设备ID |
| mtu | `string` | 最大传输单元 |

### Callback

蓝牙低功耗的最大传输单元变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

## 示例代码

```tsx
Taro.onBLEMTUChange(function (res) {
  console.log('bluetooth mtu is', res.mtu)
})
```
