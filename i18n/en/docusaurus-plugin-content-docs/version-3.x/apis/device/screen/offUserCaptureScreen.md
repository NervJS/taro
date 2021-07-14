---
title: Taro.offUserCaptureScreen(callback)
sidebar_label: offUserCaptureScreen
---

Un-listens on the event that the user actively takes screenshots.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/screen/wx.offUserCaptureScreen.html)

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
      <td>The callback function for the event that the user actively takes screenshots.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offUserCaptureScreen | ✔️ |  |  |
