---
title: Taro.onBLEConnectionStateChange(callback)
sidebar_label: onBLEConnectionStateChange
---

监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLEConnectionStateChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### CallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>connected</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the device is connected</td>
    </tr>
    <tr>
      <td>deviceId</td>
      <td><code>string</code></td>
      <td>The Bluetooth device ID</td>
    </tr>
  </tbody>
</table>

### Callback

The callback function for the BLE connection status change event.

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onBLEConnectionStateChange(function (res) {
  // You can use the callback for this method to handle accidental disconnects and other exceptions. console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
})
```

## API Support

|               API               | WeChat Mini-Program | H5 | React Native |
|:-------------------------------:|:-------------------:|:--:|:------------:|
| Taro.onBLEConnectionStateChange |         ✔️          |    |              |
