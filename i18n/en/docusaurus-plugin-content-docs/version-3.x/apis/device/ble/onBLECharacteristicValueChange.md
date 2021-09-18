---
title: Taro.onBLECharacteristicValueChange(callback)
sidebar_label: onBLECharacteristicValueChange
---

Listens on the BLE device characteristic change event. You must enable `notifyBLECharacteristicValueChange` to receive notifications pushed by devices.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth-ble/wx.onBLECharacteristicValueChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the BLE device characteristic change event.

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
      <td>characteristicId</td>
      <td><code>string</code></td>
      <td>The Bluetooth characteristic UUID</td>
    </tr>
    <tr>
      <td>deviceId</td>
      <td><code>string</code></td>
      <td>The Bluetooth device ID</td>
    </tr>
    <tr>
      <td>serviceId</td>
      <td><code>string</code></td>
      <td>The UUID of the service corresponding to a Bluetooth characteristic</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>ArrayBuffer</code></td>
      <td>The latest value of a characteristic</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
// Example of an ArrayBuffer converted to a hexadecimal string
function ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
Taro.onBLECharacteristicValueChange(function (res) {
  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
  console.log(ab2hex(res.value))
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBLECharacteristicValueChange | ✔️ |  |  |
