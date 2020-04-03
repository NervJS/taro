---
title: Taro.onBLEConnectionStateChange(callback)
sidebar_label: onBLEConnectionStateChange
id: version-1.3.37-onBLEConnectionStateChange
original_id: onBLEConnectionStateChange
---

监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLEConnectionStateChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| connected | `boolean` | 是否处于已连接状态 |
| deviceId | `string` | 蓝牙设备ID |

### Callback

低功耗蓝牙连接状态的改变事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

## 示例代码

```tsx
Taro.onBLEConnectionStateChange(function (res) {
  // 该方法回调中可以用于处理连接意外断开等异常情况
  console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBLEConnectionStateChange | ✔️ |  |  |
