---
title: Taro.onAudioInterruptionEnd(callback)
sidebar_label: onAudioInterruptionEnd
---

Listens on the event that audio interruption ends. After the onAudioInterruptionBegin event is received, all audio files in the Mini Program are paused. After the event is received, audio files can be played again.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.onAudioInterruptionEnd.html)

## Type

```tsx
(callback: (res: CallbackResult) => void) => void
```

## Parameters

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the event that audio interruption ends.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onAudioInterruptionEnd | ✔️ |  |  |
