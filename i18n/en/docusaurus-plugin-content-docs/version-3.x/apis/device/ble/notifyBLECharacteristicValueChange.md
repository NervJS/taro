---
title: Taro.notifyBLECharacteristicValueChange(option)
sidebar_label: notifyBLECharacteristicValueChange
---

Enables the notify feature when characteristics of a BLE device change to subscribe to characteristics. Note: The device characteristics must support notify or indicate to use this method.


In addition, you must enable `notifyBLECharacteristicValueChange` to listen on the device `characteristicValueChange` event.

**Notes**
- After a successful subscription, the device must actively update the value of the characteristic to trigger the `Taro.onBLECharacteristicValueChange` callback.
- On the Android platform, if the `writeBLECharacteristicValue` API is called right after the call to `notifyBLECharacteristicValueChange`, some device models will report a 10008 system error.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth-ble/wx.notifyBLECharacteristicValueChange.html)

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
      <td>success: ok，fail: error message</td>
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
      <td>state</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Indicates whether notify is enabled</td>
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
Taro.notifyBLECharacteristicValueChange({
  state: true, // Enable the notify feature
  // This deviceId must have been used to connect the appropriate device via createBLEConnection.
  deviceId,
  // This serviceId must be obtained in the getBLEDeviceServices API.
  serviceId,
  // This characteristicId must be obtained in the getBLEDeviceCharacteristics API.
  characteristicId,
  success: function (res) {
    console.log('notifyBLECharacteristicValueChange success', res.errMsg)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.notifyBLECharacteristicValueChange | ✔️ |  |  |
