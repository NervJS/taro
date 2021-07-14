---
title: Taro.getBLEDeviceServices(option)
sidebar_label: getBLEDeviceServices
---

Gets all services of a Bluetooth device.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth-ble/wx.getBLEDeviceServices.html)

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
      <td>services</td>
      <td><code>BLEService[]</code></td>
      <td>The device service list</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>success: ok，fail: error message</td>
    </tr>
  </tbody>
</table>

### BLEService

res.services is composed as follows

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
      <td>isPrimary</td>
      <td><code>boolean</code></td>
      <td>Indicates whether this service is the primary service</td>
    </tr>
    <tr>
      <td>uuid</td>
      <td><code>string</code></td>
      <td>The Bluetooth device service UUID</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getBLEDeviceServices({
  // This deviceId must have been used to connect the appropriate device via createBLEConnection.
  deviceId,
  success: function (res) {
    console.log('device services:', res.services)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBLEDeviceServices | ✔️ |  |  |
