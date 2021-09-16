---
title: Taro.writeBLECharacteristicValue(option)
sidebar_label: writeBLECharacteristicValue
---

Writes hexadecimal data to BLE device characteristics. Note: The device characteristics must support write to use this method.

**Notes**

- Multiple parallel calls may cause write failures.
- Mini Programs do not limit the size of written packets, but the system and Bluetooth device will restrict the data size transfered over Bluetooth 4.0 at a time. If the maximum number of bytes is exceeded, a write exception occurs. The size of each write operation should be limited to 20 bytes.
- If too much data is written at a time, the iOS system does not provide any callbacks (including error callbacks).
- On the Android platform, if the `writeBLECharacteristicValue` API is called right after the call to `notifyBLECharacteristicValueChange`, some device models will report a 10008 system error.


> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth-ble/wx.writeBLECharacteristicValue.html)

## Type

```tsx
(option: Option) => Promise<Promised>
```

## Parameters

### Promised

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>success: ok; fail: error message.</td>
    </tr>
  </tbody>
</table>

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
      <td>characteristicId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The Bluetooth characteristic UUID</td>
    </tr>
    <tr>
      <td>deviceId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The Bluetooth device ID</td>
    </tr>
    <tr>
      <td>serviceId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The UUID of the service corresponding to a Bluetooth characteristic</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>ArrayBuffer</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The hexadecimal value corresponding to the Bluetooth device characteristic.</td>
    </tr>
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

## Sample Code

```tsx
// Send a hexadecimal value of 0x00 to the Bluetooth device.
let buffer = new ArrayBuffer(1)
let dataView = new DataView(buffer)
dataView.setUint8(0, 0)
Taro.writeBLECharacteristicValue({
  // This deviceId must be obtained in the getBluetoothDevices or onBluetoothDeviceFound API.
  deviceId,
  // This serviceId must be obtained in the getBLEDeviceServices API.
  serviceId,
  // This characteristicId must be obtained in the getBLEDeviceCharacteristics API.
  characteristicId,
  // This value is ArrayBuffer type.
  value: buffer,
  success: function (res) {
    console.log('writeBLECharacteristicValue success', res.errMsg)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.writeBLECharacteristicValue | ✔️ |  |  |
