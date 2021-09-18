---
title: Taro.offLocationChange(callback)
sidebar_label: offLocationChange
---

Un-listens to live geolocation change events.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.offLocationChange.html)

## Type

```tsx
(callback: (res: CallbackResult) => void) => void
```

## Parameters

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
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>Callback function for real-time geolocation change events.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offLocationChange | ✔️ |  |  |
