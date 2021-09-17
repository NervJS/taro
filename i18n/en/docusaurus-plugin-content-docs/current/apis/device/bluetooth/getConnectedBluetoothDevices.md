---
title: Taro.getConnectedBluetoothDevices(option)
sidebar_label: getConnectedBluetoothDevices
---

Gets devices in the connected status based on the UUIDs.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth/wx.getConnectedBluetoothDevices.html)

## Type

```tsx
(option: Option) => void
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
      <td>services</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The list of primary service UUIDs of Bluetooth devices</td>
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
      <td>devices</td>
      <td><code>BluetoothDeviceInfo[]</code></td>
      <td>The list of discovered devices</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>success: ok; fail: error message.</td>
    </tr>
  </tbody>
</table>

### BluetoothDeviceInfo

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
      <td>deviceId</td>
      <td><code>string</code></td>
      <td>Device ID</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td>The name of the Bluetooth device. Some devices may not have a name.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getConnectedBluetoothDevices({
  success: function (res) {
    console.log(res)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getConnectedBluetoothDevices | ✔️ |  |  |
