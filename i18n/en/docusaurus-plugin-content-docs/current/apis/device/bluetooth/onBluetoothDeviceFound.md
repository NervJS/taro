---
title: Taro.onBluetoothDeviceFound(callback)
sidebar_label: onBluetoothDeviceFound
---

Listens on the new device discovery event.

**Notes**

- If a device is called back in `Taro.onBluetoothDeviceFound`, this device is added to the array obtained by the `Taro.getBluetoothDevices` API.
- Some Android models require location permissions before they can discover devices. Be sure to grant location permissions in such cases.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth/wx.onBluetoothDeviceFound.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the new device discovery event.

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
      <td>devices</td>
      <td><code>CallbackResultBlueToothDevice[]</code></td>
      <td>The list of newly discovered devices</td>
    </tr>
  </tbody>
</table>

### CallbackResultBlueToothDevice

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
      <td>RSSI</td>
      <td><code>number</code></td>
      <td>The signal strength of the current Bluetooth device</td>
    </tr>
    <tr>
      <td>advertisData</td>
      <td><code>ArrayBuffer</code></td>
      <td>The ManufacturerData field in the broadcast data field of the current Bluetooth device</td>
    </tr>
    <tr>
      <td>advertisServiceUUIDs</td>
      <td><code>string[]</code></td>
      <td>The ServiceUUIDs field in the broadcast data field of the current Bluetooth device</td>
    </tr>
    <tr>
      <td>deviceId</td>
      <td><code>string</code></td>
      <td>Device ID</td>
    </tr>
    <tr>
      <td>localName</td>
      <td><code>string</code></td>
      <td>The LocalName field in the broadcast data field of the current Bluetooth device</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td>The name of the Bluetooth device. Some devices may not have a name.</td>
    </tr>
    <tr>
      <td>serviceData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The ServiceData field in the broadcast data field of the current Bluetooth device</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
// Example of an ArrayBuffer converted to a hexadecimal string
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
Taro.onBluetoothDeviceFound(function (res) {
  var devices = res.devices;
  console.log('new device list has founded')
  console.dir(devices)
  console.log(ab2hex(devices[0].advertisData))
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBluetoothDeviceFound | ✔️ |  |  |
