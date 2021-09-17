---
title: Taro.pauseVoice(option)
sidebar_label: pauseVoice
---

Pauses the playback of a voice file. If the same voice file is played again by calling [Taro.playVoice](./playVoice.md), it is resumed from the point where it was paused. If you want to play the file from the beginning, call [Taro.stopVoice](./stopVoice.md) first.

**As of base library 1.6.0, this API is not maintained. Use [Taro.createInnerAudioContext](./createInnerAudioContext.md) instead.**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/wx.pauseVoice.html)

## Type

```tsx
(option?: Option) => void
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.startRecord({
  success: function (res) {
    var tempFilePath = res.tempFilePath
      Taro.playVoice({
      filePath: tempFilePath
    })
    setTimeout(function() {
      // pause
      Taro.pauseVoice()
    }, 5000)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.pauseVoice | ✔️ |  |  |
