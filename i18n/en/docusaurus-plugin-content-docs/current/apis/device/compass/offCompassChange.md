---
title: Taro.offCompassChange(callback)
sidebar_label: offCompassChange
---

Stops listening for compass data events. If the parameter is empty, all event listening is stopped.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/compass/wx.offCompassChange.html)

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
      <td>The callback function for the compass data change event.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offCompassChange | ✔️ |  |  |
