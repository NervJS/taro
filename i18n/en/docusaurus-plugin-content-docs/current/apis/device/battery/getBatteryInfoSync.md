---
title: Taro.getBatteryInfoSync()
sidebar_label: getBatteryInfoSync
---

The synchronous version of `Taro.getBatteryInfo`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/battery/wx.getBatteryInfoSync.html)

## Type

```tsx
() => Result
```

## Parameters

### Result

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
      <td>isCharging</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the device is charging.</td>
    </tr>
    <tr>
      <td>level</td>
      <td><code>string</code></td>
      <td>The device's battery level. Range: 1-100.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBatteryInfoSync | ✔️ |  |  |
