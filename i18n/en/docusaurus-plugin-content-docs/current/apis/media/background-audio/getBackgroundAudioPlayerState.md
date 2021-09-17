---
title: Taro.getBackgroundAudioPlayerState(option)
sidebar_label: getBackgroundAudioPlayerState
---

Gets the background music playback status.

**NOTE: As of base library 1.2.0, the API is not maintained. Please use [Taro.getBackgroundAudioManager](./getBackgroundAudioManager.md) instead.**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/background-audio/wx.getBackgroundAudioPlayerState.html)

## Type

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
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

### SuccessCallbackResult

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
      <td>currentPosition</td>
      <td><code>number</code></td>
      <td>The position where the playback of the selected audio has got to (in sec). It is only returned duing the music playback.</td>
    </tr>
    <tr>
      <td>dataUrl</td>
      <td><code>string</code></td>
      <td>The song's URL. It is only returned during the music playback.</td>
    </tr>
    <tr>
      <td>downloadPercent</td>
      <td><code>number</code></td>
      <td>The download progress percentage of an audio file. It is only returned during the music playback.</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>The duration of the selected audio (in sec). It is only returned during the music playback.</td>
    </tr>
    <tr>
      <td>status</td>
      <td><code>0 | 1 | 2</code></td>
      <td>Playback status</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### status

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>Pausing</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Playing</td>
    </tr>
    <tr>
      <td>2</td>
      <td>No music is playing</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getBackgroundAudioPlayerState({
  success: function (res) {
    var status = res.status
    var dataUrl = res.dataUrl
    var currentPosition = res.currentPosition
    var duration = res.duration
    var downloadPercent = res.downloadPercent
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBackgroundAudioPlayerState | ✔️ |  |  |
