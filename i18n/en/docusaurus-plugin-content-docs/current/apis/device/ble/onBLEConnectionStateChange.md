---
title: Taro.onBLEConnectionStateChange(callback)
sidebar_label: onBLEConnectionStateChange
---

Listens on the BLE connection status change event, including connections manually established or disconnected by developers, device loss, and unusual disconnections.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth-ble/wx.onBLEConnectionStateChange.html)

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
  // You can use the callback for this method to handle accidental disconnects and other exceptions.
  console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBLEConnectionStateChange | ✔️ |  |  |
