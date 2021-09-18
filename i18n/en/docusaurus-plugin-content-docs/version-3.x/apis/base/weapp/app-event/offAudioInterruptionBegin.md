---
title: Taro.offAudioInterruptionBegin(callback)
sidebar_label: offAudioInterruptionBegin
---

Un-listens on the event that audio interruption starts due to system occupation.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.offAudioInterruptionBegin.html)

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
      <td>The callback function for the event that audio interruption starts due to system occupation.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offAudioInterruptionBegin | ✔️ |  |  |
