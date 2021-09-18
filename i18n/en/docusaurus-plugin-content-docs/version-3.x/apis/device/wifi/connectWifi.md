---
title: Taro.connectWifi(option)
sidebar_label: connectWifi
---

Connects to the Wi-Fi network. If the information of the Wi-Fi network is available, this API can be directly used to establish a connection to the Wi-Fi network. **This is supported only on Android and iOS 11 or above.**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/wifi/wx.connectWifi.html)

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
      <td>SSID</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The SSID of the Wi-Fi device</td>
    </tr>
    <tr>
      <td>BSSID</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The BSSID of the Wi-Fi device</td>
    </tr>
    <tr>
      <td>password</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The password of the Wi-Fi device</td>
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
Taro.connectWifi({
  SSID: '',
  BSSID: '',
  success: function (res) {
    console.log(res.errMsg)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.connectWifi | ✔️ |  |  |
