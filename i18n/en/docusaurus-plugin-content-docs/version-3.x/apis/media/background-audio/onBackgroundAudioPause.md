---
title: Taro.onBackgroundAudioPause(callback)
sidebar_label: onBackgroundAudioPause
---

Listens on the event of pausing music playback.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/background-audio/wx.onBackgroundAudioPause.html)

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
      <td>The callback function for the event of pausing music playback.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBackgroundAudioPause | ✔️ |  |  |
