---
title: Taro.startBeaconDiscovery(option)
sidebar_label: startBeaconDiscovery
---

Starts searching for nearby iBeacon devices.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/ibeacon/wx.startBeaconDiscovery.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>uuids</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The list of iBeacon device broadcast UUIDs</td>
    </tr>
    <tr>
      <td>ignoreBluetoothAvailable</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to verify the Bluetooth switch (only effective in iOS)</td>
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
Taro.startBeaconDiscovery({
  success: function (res) { }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startBeaconDiscovery | ✔️ |  |  |
