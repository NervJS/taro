---
title: Taro.readBLECharacteristicValue(option)
sidebar_label: readBLECharacteristicValue
---

Reads the hexadecimal data values of the BLE device characteristics. Note: The device characteristics must support read to use this method.

**Notes**
- Multiple parallel calls may cause read failures.
- The information read by the API must be obtained in the callback registered in the `onBLECharacteristicValueChange` method.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth-ble/wx.readBLECharacteristicValue.html)

## Type

```tsx
(option: Option) => Promise<BluetoothError>
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
// You must perform a callback here to get the information.
Taro.onBLECharacteristicValueChange(function(characteristic) {
  console.log('characteristic value comed:', characteristic)
})
Taro.readBLECharacteristicValue({
  // This deviceId must have been used to connect the appropriate device via createBLEConnection.
  deviceId,
  // This serviceId must be obtained in the getBLEDeviceServices API.
  serviceId,
  // This characteristicId must be obtained in the getBLEDeviceCharacteristics API.
  characteristicId,
  success (res) {
    console.log('readBLECharacteristicValue:', res.errCode)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.readBLECharacteristicValue | ✔️ |  |  |
