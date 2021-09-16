---
title: Taro.createBLEConnection(option)
sidebar_label: createBLEConnection
---

Connects to a BLE device.

If the Mini Program has previously discovered a Bluetooth device and successfully connected to it, you can directly pass the deviceId obtained previously to connect to the device, without the need to perform a search operation.

**Notes**
- Ensure the calls to the createBLEConnection and `closeBLEConnection` APIs are paired. On an Android device, if you call `createBLEConnection` multiple times, the system may maintain multiple connection instances for the same device. Therefore, calling `closeBLEConnection` will not truly disconnect from the device.
- Bluetooth connections may be dropped at any time, so you should listen on the `Taro.onBLEConnectionStateChange` callback event. If the connection with a Bluetooth device is lost, you can reconnect it as needed.
- If you call data read/write APIs for an unconnected or a disconnected device, a 10006 error is returned. We recommend you reconnect the device in such cases.


> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth-ble/wx.createBLEConnection.html)

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
      <td>deviceId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Device ID</td>
    </tr>
    <tr>
      <td>timeout</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The timeout time (in ms). If it is left empty, there is no timeout.</td>
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
Taro.createBLEConnection({
  // This deviceId must have been used to connect the appropriate device via createBLEConnection.
  deviceId,
  success: function (res) {
    console.log(res)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createBLEConnection | ✔️ |  |  |
