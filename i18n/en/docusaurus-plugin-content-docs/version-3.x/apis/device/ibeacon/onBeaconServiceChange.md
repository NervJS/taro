---
title: Taro.onBeaconServiceChange(callback)
sidebar_label: onBeaconServiceChange
---

Listens on the iBeacon service status change event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/ibeacon/wx.onBeaconServiceChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the iBeacon service status change event.

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
      <td>available</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the service is available</td>
    </tr>
    <tr>
      <td>discovering</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the device is in the discovery status</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBeaconServiceChange | ✔️ |  |  |
