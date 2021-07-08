---
title: Taro.onAudioInterruptionBegin(callback)
sidebar_label: onAudioInterruptionBegin
---

Listens on the event that audio interruption starts due to system occupation. This event is triggered by the following scenarios: alarm, phone call, FaceTime call, WeChat voice chat, and WeChat video chat. After the event is triggered, all audio files in the Mini Program are paused.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.onAudioInterruptionBegin.html)

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
      <td>The callback function for the event that audio interruption starts due to system occupation.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onAudioInterruptionBegin | ✔️ |  |  |
