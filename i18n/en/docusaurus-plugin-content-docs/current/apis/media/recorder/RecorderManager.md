---
title: RecorderManager
sidebar_label: RecorderManager
---

The globally unique recording manager.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.html)

## Methods

### onError

Listens on the recording error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

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
      <td><code>OnErrorCallback</code></td>
      <td>The callback function for the recording error event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onError | ✔️ |  | ✔️ |

### onFrameRecorded

Listens on the event that the file with specified frame size has been recorded. This event is called back if frameSize is set.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.onFrameRecorded.html)

```tsx
(callback: OnFrameRecordedCallback) => void
```

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
      <td><code>OnFrameRecordedCallback</code></td>
      <td>The callback function for the event that the file with specified frame size has been recorded</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onFrameRecorded | ✔️ |  |  |

### onInterruptionBegin

Listens on the event that recording interruption starts due to system occupation. This event is triggered by the following scenarios: WeChat voice chat and WeChat video chat. After this event is triggered, the recording is paused. The pause event is triggered after this event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.onInterruptionBegin.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

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
      <td>The callback function for the event that recording interruption starts due to system occupation.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onInterruptionBegin | ✔️ |  |  |

### onInterruptionEnd

Listens on the event that recording interruption ends. After the interruptionBegin event is received, all recording in the Mini Program is paused. After this event is received, recording can be started again.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.onInterruptionEnd.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

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
      <td>The callback function for the event that recording interruption ends.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onInterruptionEnd | ✔️ |  |  |

### onPause

Listens on the event that recording pauses.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.onPause.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

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
      <td>The callback function for the event that recording pauses.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onPause | ✔️ |  | ✔️ |

### onResume

Listens on the event that recording resumes.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.onResume.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

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
      <td>The callback function for the event that recording resumes.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onResume | ✔️ |  | ✔️ |

### onStart

Listens on the event that recording starts.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.onStart.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

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
      <td>The callback function for the event that recording starts.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onStart | ✔️ |  | ✔️ |

### onStop

Listens on the event that recording ends.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.onStop.html)

```tsx
(callback: OnStopCallback) => void
```

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
      <td><code>OnStopCallback</code></td>
      <td>The callback function for the event that recording ends.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onStop | ✔️ |  | ✔️ |

### pause

Pauses recording

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.pause.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.pause | ✔️ |  | ✔️ |

### resume

Resumes recording

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.resume.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.resume | ✔️ |  | ✔️ |

### start

Starts recording

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.start.html)

```tsx
(option: StartOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>StartOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.start | ✔️ |  | ✔️ |

### stop

Stops recording

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/RecorderManager.stop.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.stop | ✔️ |  | ✔️ |

## Parameters

### OnErrorCallback

The callback function for the recording error event.

```tsx
(result: OnErrorCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnErrorCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnErrorCallbackResult

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
  </tbody>
</table>

### OnFrameRecordedCallback

The callback function for the event that the file with specified frame size has been recorded

```tsx
(result: OnFrameRecordedCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnFrameRecordedCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnFrameRecordedCallbackResult

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
      <td>frameBuffer</td>
      <td><code>ArrayBuffer</code></td>
      <td>Recording frame data</td>
    </tr>
    <tr>
      <td>isLastFrame</td>
      <td><code>boolean</code></td>
      <td>Whether the current frame is the last frame before the end of recording</td>
    </tr>
  </tbody>
</table>

### OnStopCallback

The callback function for the event that recording ends.

```tsx
(result: OnStopCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnStopCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnStopCallbackResult

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
      <td>duration</td>
      <td><code>number</code></td>
      <td>The duration of recording (in sec)</td>
    </tr>
    <tr>
      <td>fileSize</td>
      <td><code>number</code></td>
      <td>The size of a recording file (in bytes)</td>
    </tr>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>The temporary path to recording files</td>
    </tr>
  </tbody>
</table>

### StartOption

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
      <td>audioSource</td>
      <td><code>&quot;auto&quot; | &quot;buildInMic&quot; | &quot;headsetMic&quot; | &quot;mic&quot; | &quot;camcorder&quot; | &quot;voice_communication&quot; | &quot;voice_recognition&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the audio source for recording. Available audio sources can be obtained via <code>Taro.getAvailableAudioSources()</code>.</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Recording duration (in ms). The maximum value is 600,000 (10 minutes).</td>
    </tr>
    <tr>
      <td>encodeBitRate</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Encoding bitrate. Valid values are shown in the following table.</td>
    </tr>
    <tr>
      <td>format</td>
      <td><code>&quot;mp3&quot; | &quot;aac&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Audio format</td>
    </tr>
    <tr>
      <td>frameSize</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the frame size (in KB). If this field is specified, the recorded file will be called back whenever reaching the specified frame size. If it is not specified, the recorded file will not be called back. Only MP3 format is supported.</td>
    </tr>
    <tr>
      <td>numberOfChannels</td>
      <td><code>1 | 2</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Number of recording channels</td>
    </tr>
    <tr>
      <td>sampleRate</td>
      <td><code>8000 | 11025 | 12000 | 16000 | 22050 | 24000 | 32000 | 44100 | 48000</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sampling rate</td>
    </tr>
  </tbody>
</table>

### audioSource

Valid values of object.audioSource

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

### format

Valid values of object.format

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mp3</td>
      <td>MP3 format</td>
    </tr>
    <tr>
      <td>aac</td>
      <td>AAC format</td>
    </tr>
  </tbody>
</table>

### numberOfChannels

Valid values of object.numberOfChannels

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>1 channel</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2 channels</td>
    </tr>
  </tbody>
</table>

### sampleRate

Valid values of object.sampleRate

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
      <th>Encoding code rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>8000</td>
      <td>8000 Hz sample rate</td>
      <td><code>16000 ~ 48000</code></td>
    </tr>
    <tr>
      <td>11025</td>
      <td>11025 Hz sample rate</td>
      <td><code>16000 ~ 48000</code></td>
    </tr>
    <tr>
      <td>12000</td>
      <td>12000 Hz sample rate</td>
      <td><code>24000 ~ 64000</code></td>
    </tr>
    <tr>
      <td>16000</td>
      <td>16000 Hz sample rate</td>
      <td><code>24000 ~ 96000</code></td>
    </tr>
    <tr>
      <td>22050</td>
      <td>22050 Hz sample rate</td>
      <td><code>32000 ~ 128000</code></td>
    </tr>
    <tr>
      <td>24000</td>
      <td>24000 Hz sample rate</td>
      <td><code>32000 ~ 128000</code></td>
    </tr>
    <tr>
      <td>32000</td>
      <td>32000 Hz sample rate</td>
      <td><code>48000 ~ 192000</code></td>
    </tr>
    <tr>
      <td>44100</td>
      <td>44100 Hz sample rate</td>
      <td><code>64000 ~ 320000</code></td>
    </tr>
    <tr>
      <td>48000</td>
      <td>48000 Hz sample rate</td>
      <td><code>64000 ~ 320000</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onError | ✔️ |  | ✔️ |
| RecorderManager.onFrameRecorded | ✔️ |  |  |
| RecorderManager.onInterruptionBegin | ✔️ |  |  |
| RecorderManager.onInterruptionEnd | ✔️ |  |  |
| RecorderManager.onPause | ✔️ |  | ✔️ |
| RecorderManager.onResume | ✔️ |  | ✔️ |
| RecorderManager.onStart | ✔️ |  | ✔️ |
| RecorderManager.onStop | ✔️ |  | ✔️ |
| RecorderManager.pause | ✔️ |  | ✔️ |
| RecorderManager.resume | ✔️ |  | ✔️ |
| RecorderManager.start | ✔️ |  | ✔️ |
| RecorderManager.stop | ✔️ |  | ✔️ |
