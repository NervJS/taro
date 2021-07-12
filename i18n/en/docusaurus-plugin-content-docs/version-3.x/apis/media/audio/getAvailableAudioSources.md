---
title: Taro.getAvailableAudioSources(option)
sidebar_label: getAvailableAudioSources
---

Gets supported audio input sources.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/wx.getAvailableAudioSources.html)

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
      <td>audioSources</td>
      <td><code>(&quot;auto&quot; | &quot;buildInMic&quot; | &quot;headsetMic&quot; | &quot;mic&quot; | &quot;camcorder&quot; | &quot;voice_communication&quot; | &quot;voice_recognition&quot;)[]</code></td>
      <td>The list of supported audio input sources. It can be used in the API<a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.start.html">RecorderManager.start()</a>. For the definitions of returned values, please see https://developer.android.com/reference/kotlin/android/media/MediaRecorder.AudioSource
</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### audioSources

Valid values of res.audioSources

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>auto</td>
      <td>Automatic setup. The mobile microphone is used by default. The headset microphone is automatically adopted when the headset is plugged in. This setup applies to all platforms.</td>
    </tr>
    <tr>
      <td>buildInMic</td>
      <td>Mobile microphone for iOS only</td>
    </tr>
    <tr>
      <td>headsetMic</td>
      <td>Headset microphone for iOS only</td>
    </tr>
    <tr>
      <td>mic</td>
      <td>Microphone (if the headset is not plugged in, the mobile microphone is used; otherwise, the headset microphone is used) for Android only</td>
    </tr>
    <tr>
      <td>camcorder</td>
      <td>Same as mic. Suitable for audio and video recording. For Android only.</td>
    </tr>
    <tr>
      <td>voice_communication</td>
      <td>Same as mic. Suitable for real-time communication. For Android only.</td>
    </tr>
    <tr>
      <td>voice_recognition</td>
      <td>Same as mic. Suitable for speech recognition. For Android only.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getAvailableAudioSources | ✔️ |  |  |
