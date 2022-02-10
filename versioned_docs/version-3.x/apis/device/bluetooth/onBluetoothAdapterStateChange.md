---
title: Taro.onBluetoothAdapterStateChange(callback)
sidebar_label: onBluetoothAdapterStateChange
---

监听蓝牙适配器状态变化事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 蓝牙适配器状态变化事件的回调函数 |

### Callback

蓝牙适配器状态变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| available | `boolean` | 蓝牙适配器是否可用 |
| discovering | `boolean` | 蓝牙适配器是否处于搜索状态 |

## 示例代码

```tsx
Taro.onBluetoothAdapterStateChange(function (res) {
  console.log('adapterState changed, now is', res)
})
```
