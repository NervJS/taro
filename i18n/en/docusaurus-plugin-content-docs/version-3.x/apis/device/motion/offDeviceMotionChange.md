---
title: Taro.offDeviceMotionChange(callback)
sidebar_label: offDeviceMotionChange
---

Stops listening for device orientation change events. If the parameter is empty, all event listening is stopped.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/motion/wx.offDeviceMotionChange.html)

## Type

```tsx
(callback: (...args: any[]) => any) => void
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
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td>The callback function for the device orientation change event.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offDeviceMotionChange | ✔️ |  |  |
