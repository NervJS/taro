---
title: Taro.setWifiList(option)
sidebar_label: setWifiList
---

Sets the information on the AP in `wifiList`, which is called after the `onGetWifiList` callback. **This API is specific to iOS.**

**Notes**
- This API can only be called after the `onGetWifiList` callback.
- In this case, the app will be suspended and wait for the Mini Program to set the Wi-Fi network's information. Call the API as soon as possible. If no data is available, pass an empty array.
- Multiple callbacks with a list of duplicate Wi-Fi devices may be received in a single process as the list of nearby Wi-Fi devices is refreshed.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/wifi/wx.setWifiList.html)

## Type

```tsx
(option: Option) => Promise<WifiError>
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
      <td>wifiList</td>
      <td><code>WifiData[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Provides a list of preset information of the Wi-Fi network</td>
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

### WifiData

object.wifiList is composed as follows

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
      <td>BSSID</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The SSID of the Wi-Fi network</td>
    </tr>
    <tr>
      <td>SSID</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The BSSID of the Wi-Fi network</td>
    </tr>
    <tr>
      <td>password</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The password of the Wi-Fi device</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onGetWifiList(function (res) {
  if (res.wifiList.length) {
    Taro.setWifiList({
      wifiList: [{
        SSID: res.wifiList[0].SSID,
        BSSID: res.wifiList[0].BSSID,
        password: '123456'
      }]
    })
  } else {
    Taro.setWifiList({
      wifiList: []
    })
  }
})
Taro.getWifiList()
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setWifiList | ✔️ |  |  |
