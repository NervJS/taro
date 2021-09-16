---
title: Taro.onWifiConnected(callback)
sidebar_label: onWifiConnected
---

Listens on the event of connecting to the Wi-Fi network.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/wifi/wx.onWifiConnected.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for event of connecting to the Wi-Fi network.

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

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
      <td>wifi</td>
      <td><code>WifiInfo</code></td>
      <td>Information of the Wi-Fi network</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onWifiConnected | ✔️ |  |  |
