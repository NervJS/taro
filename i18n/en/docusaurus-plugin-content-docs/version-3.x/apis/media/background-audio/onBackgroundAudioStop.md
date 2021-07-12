---
title: Taro.onBackgroundAudioStop(callback)
sidebar_label: onBackgroundAudioStop
---

Listens on the event of stopping music playback.

**bug & tip：**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/background-audio/wx.onBackgroundAudioStop.html)

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
      <td>The callback function for the event of stopping music playback.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBackgroundAudioStop | ✔️ |  |  |
