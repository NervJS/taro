---
title: Taro.onBeaconUpdate(callback)
sidebar_label: onBeaconUpdate
---

Listens on the iBeacon device update event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/ibeacon/wx.onBeaconUpdate.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the iBeacon device update event.

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
      <td>beacons</td>
      <td><code>IBeaconInfo[]</code></td>
      <td>The list of all iBeacon devices discovered</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBeaconUpdate | ✔️ |  |  |
