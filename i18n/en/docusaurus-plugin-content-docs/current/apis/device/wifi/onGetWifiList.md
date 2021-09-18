---
title: Taro.onGetWifiList(callback)
sidebar_label: onGetWifiList
---

Listens on the event of getting the list of Wi-Fi networks.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/wifi/wx.onGetWifiList.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the event of getting the list of Wi-Fi networks.

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
      <td>wifiList</td>
      <td><code>WifiInfo[]</code></td>
      <td>The list of Wi-Fi networks</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onGetWifiList | ✔️ |  |  |
