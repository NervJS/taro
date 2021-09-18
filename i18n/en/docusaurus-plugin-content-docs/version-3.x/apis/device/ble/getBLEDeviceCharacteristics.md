---
title: Taro.getBLEDeviceCharacteristics(option)
sidebar_label: getBLEDeviceCharacteristics
---

Gets all characteristics in a Bluetooth device service.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth-ble/wx.getBLEDeviceCharacteristics.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult>
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
      <td>deviceId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The Bluetooth device ID</td>
    </tr>
    <tr>
      <td>serviceId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The Bluetooth service UUID, which is obtained via <code>getBLEDeviceServices</code></td>
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
      <td>characteristics</td>
      <td><code>BLECharacteristic[]</code></td>
      <td>The list of device characteristics</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>success: ok，fail: error message</td>
    </tr>
  </tbody>
</table>

### BLECharacteristic

res.characteristics is composed as follows

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
      <td>properties</td>
      <td><code>Properties</code></td>
      <td>The operation types supported by this characteristic</td>
    </tr>
    <tr>
      <td>uuid</td>
      <td><code>string</code></td>
      <td>The Bluetooth device characteristic UUID</td>
    </tr>
  </tbody>
</table>

### Properties

properties is composed as follows

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
      <td>indicate</td>
      <td><code>boolean</code></td>
      <td>Indicates whether this characteristic supports indicate operation</td>
    </tr>
    <tr>
      <td>notify</td>
      <td><code>boolean</code></td>
      <td>Indicates whether this characteristic supports notify operation</td>
    </tr>
    <tr>
      <td>read</td>
      <td><code>boolean</code></td>
      <td>Indicates whether this characteristic supports read operation</td>
    </tr>
    <tr>
      <td>write</td>
      <td><code>boolean</code></td>
      <td>Indicates whether this characteristic supports write operation</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getBLEDeviceCharacteristics({
  // This deviceId must have been used to connect the appropriate device via createBLEConnection.
  deviceId,
  // This serviceId must be obtained in the getBLEDeviceServices API.
  serviceId,
  success: function (res) {
    console.log('device getBLEDeviceCharacteristics:', res.characteristics)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBLEDeviceCharacteristics | ✔️ |  |  |
