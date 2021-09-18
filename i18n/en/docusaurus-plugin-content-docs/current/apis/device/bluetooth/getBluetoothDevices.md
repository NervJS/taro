---
title: Taro.getBluetoothDevices(option)
sidebar_label: getBluetoothDevices
---

Obtains all Bluetooth devices discovered during the active period of the Bluetooth module, including all devices that are already connected to the mobile.

**Notes**
- This API obtains a device list of `all Bluetooth devices discovered during the active period of the Bluetooth module`. If you do not promptly call wx.closeBluetoothAdapter to release system resources after the end of the Bluetooth module process, calling this API will return Bluetooth devices discovered in the previous Bluetooth process. These devices may no longer be near the user, and thus cannot be connected.

- When a Bluetooth device is discovered, the name field returned by the system is generally the device name in the LocalName field in the broadcast package. If a connection is established with the Bluetooth device, the name field returned by the system changes to the GattName obtained from the Bluetooth device. If you need to dynamically change and display the device name, we recommend using the localName field.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth/wx.getBluetoothDevices.html)

## Type

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

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
      <td><code>SuccessCallbackResultBlueToothDevice[]</code></td>
      <td>The list of connected devices corresponding to the UUIDs</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>成功：ok，错误：详细信息</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResultBlueToothDevice

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
Taro.getBluetoothDevices({
  success: function (res) {
    console.log(res)
    if (res.devices[0]) {
      console.log(ab2hex(res.devices[0].advertisData))
    }
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBluetoothDevices | ✔️ |  |  |
