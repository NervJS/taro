---
title: Taro.getWifiList(option)
sidebar_label: getWifiList
---

Requests to get the list of Wi-Fi networks. It returns `wifiList` data in the callback of `onGetWifiList` registration. **[User Authorization](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/authorize.html) is required for scope.userLocation before this method is called on Android.**

After a call is made, the user will be redirected to the system's Wi-Fi network interface on iOS but not on Android. This method does not work on iOS 11.0 and iOS 11.1 due to system reasons, but is available on iOS 11.2.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/wifi/wx.getWifiList.html)

## Type

```tsx
(option?: Option) => Promise<WifiError>
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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getWifiList | ✔️ |  |  |
