---
title: Taro.playBackgroundAudio(option)
sidebar_label: playBackgroundAudio
---

In WeChat App, only one piece of music can be played at a time in the background player. If the user exits the Mini Program, the music playback stops. If the music player is used by another App, the music playback in the Mini Program stops.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/background-audio/wx.playBackgroundAudio.html)

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
      <td>dataUrl</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The music's URL. M4a, AAC, MP3, and WAV file formats are supported.</td>
    </tr>
    <tr>
      <td>coverImgUrl</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Cover URL</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Music title</td>
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

## Sample Code

```tsx
Taro.playBackgroundAudio({
  dataUrl: '',
  title: '',
  coverImgUrl: ''
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.playBackgroundAudio | ✔️ |  |  |
