---
title: Taro.startBluetoothDevicesDiscovery(option)
sidebar_label: startBluetoothDevicesDiscovery
---

Starts searching for nearby Bluetooth peripherals. **This operation consumes a large amount of system resources. After searching for and connecting to a device, be sure to call the `Taro.stopBluetoothDevicesDiscovery` method to stop searching.**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth/wx.startBluetoothDevicesDiscovery.html)

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
      <td>allowDuplicatesKey</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether a device can be reported multiple times. If yes, the <code>Taro.onBlueToothDeviceFound</code> method will report a device multiple times, but with different RSSI values.。</td>
    </tr>
    <tr>
      <td>interval</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The device reporting interval. 0 indicates new devices are immediately reported. Other values indicate devices are reported based on the specified interval.</td>
    </tr>
    <tr>
      <td>services</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The list of primary service UUIDs of Bluetooth devices to be discovered. Some Bluetooth devices will broadcast their own primary service uuids. If this parameter is set, only Bluetooth devices with primary services corresponding to the uuids in the broadcast package are discovered. We recommend using this parameter to filter out nearby Bluetooth devices that are not needed.</td>
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
// For example, the primary service UUID of the smart Bluetooth light of the WeChat hardware platform is FEE7. When this parameter is provided, only the device with the primary service UUID of FEE7 is searched for.
Taro.startBluetoothDevicesDiscovery({
  services: ['FEE7'],
  success: function (res) {
    console.log(res)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startBluetoothDevicesDiscovery | ✔️ |  |  |
