---
title: Taro.setInnerAudioOption(option)
sidebar_label: setInnerAudioOption
---

Sets the playback options for [InnerAudioContext](./InnerAudioContext.md). The options apply to the current Mini Program globally once set.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/wx.setInnerAudioOption.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>mixWithOther</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Whether to play the file with other audio files played. If it is set to true, the music from other Apps or the WeChat will not be stopped.</td>
    </tr>
    <tr>
      <td>obeyMuteSwitch</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>(Only for iOS) Whether to follow the "Mute" switch. If it is set to false, the audio file still sounds even in a Mute mode.</td>
    </tr>
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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setInnerAudioOption | ✔️ |  |  |
