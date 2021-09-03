---
title: Taro.pauseVoice(option)
sidebar_label: pauseVoice
---

暂停正在播放的语音。Pauses the playback of a voice file. If the same voice file is played again by calling [Taro.playVoice](./playVoice.md), it is resumed from the point where it was paused. If you want to play the file from the beginning, call [Taro.stopVoice](./stopVoice.md) first.如果想从头开始播放，需要先调用 [Taro.stopVoice](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.stopVoice.html)。 **注意：1.6.0 版本开始，本接口不再维护。Use [Taro.createInnerAudioContext](./createInnerAudioContext.md) instead.</p>

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.pauseVoice.html)

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

|       API       | WeChat Mini-Program | H5 | React Native |
|:---------------:|:-------------------:|:--:|:------------:|
| Taro.pauseVoice |         ✔️          |    |              |
