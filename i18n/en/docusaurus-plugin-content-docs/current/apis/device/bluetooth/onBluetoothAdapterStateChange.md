---
title: Taro.onBluetoothAdapterStateChange(callback)
sidebar_label: onBluetoothAdapterStateChange
---

Listens on the Bluetooth adapter status change event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the Bluetooth adapter status change event.

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
      <td>available</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the Bluetooth adapter is available</td>
    </tr>
    <tr>
      <td>discovering</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the Bluetooth adapter is in the discovery status</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onBluetoothAdapterStateChange(function (res) {
  console.log('adapterState changed, now is', res)
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBluetoothAdapterStateChange | ✔️ |  |  |
