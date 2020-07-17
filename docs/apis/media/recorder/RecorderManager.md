---
title: RecorderManager
sidebar_label: RecorderManager
---

全局唯一的录音管理器

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.html)

## 方法

### onError

监听录音错误事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnErrorCallback</code></td>
      <td>录音错误事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onError | ✔️ |  |  |

### onFrameRecorded

监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onFrameRecorded.html)

```tsx
(callback: OnFrameRecordedCallback) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnFrameRecordedCallback</code></td>
      <td>已录制完指定帧大小的文件事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onFrameRecorded | ✔️ |  |  |

### onInterruptionBegin

监听录音因为受到系统占用而被中断开始事件。以下场景会触发此事件：微信语音聊天、微信视频聊天。此事件触发后，录音会被暂停。pause 事件在此事件后触发

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onInterruptionBegin.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>录音因为受到系统占用而被中断开始事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onInterruptionBegin | ✔️ |  |  |

### onInterruptionEnd

监听录音中断结束事件。在收到 interruptionBegin 事件之后，小程序内所有录音会暂停，收到此事件之后才可再次录音成功。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onInterruptionEnd.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>录音中断结束事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onInterruptionEnd | ✔️ |  |  |

### onPause

监听录音暂停事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onPause.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>录音暂停事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onPause | ✔️ |  |  |

### onResume

监听录音继续事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onResume.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>录音继续事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onResume | ✔️ |  |  |

### onStart

监听录音开始事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onStart.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>录音开始事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onStart | ✔️ |  |  |

### onStop

监听录音结束事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onStop.html)

```tsx
(callback: OnStopCallback) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnStopCallback</code></td>
      <td>录音结束事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onStop | ✔️ |  |  |

### pause

暂停录音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.pause.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.pause | ✔️ |  |  |

### resume

继续录音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.resume.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.resume | ✔️ |  |  |

### start

开始录音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.start.html)

```tsx
(option: StartOption) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>StartOption</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.start | ✔️ |  |  |

### stop

停止录音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.stop.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.stop | ✔️ |  |  |

## 参数

### OnErrorCallback

录音错误事件的回调函数

```tsx
(result: OnErrorCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
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

已录制完指定帧大小的文件事件的回调函数

```tsx
(result: OnFrameRecordedCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>frameBuffer</td>
      <td><code>ArrayBuffer</code></td>
      <td>录音分片数据</td>
    </tr>
    <tr>
      <td>isLastFrame</td>
      <td><code>boolean</code></td>
      <td>当前帧是否正常录音结束前的最后一帧</td>
    </tr>
  </tbody>
</table>

### OnStopCallback

录音结束事件的回调函数

```tsx
(result: OnStopCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>录音总时长，单位：ms</td>
    </tr>
    <tr>
      <td>fileSize</td>
      <td><code>number</code></td>
      <td>录音文件大小，单位：Byte</td>
    </tr>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>录音文件的临时路径</td>
    </tr>
  </tbody>
</table>

### StartOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>audioSource</td>
      <td><code>&quot;auto&quot; | &quot;buildInMic&quot; | &quot;headsetMic&quot; | &quot;mic&quot; | &quot;camcorder&quot; | &quot;voice_communication&quot; | &quot;voice_recognition&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定录音的音频输入源，可通过 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.getAvailableAudioSources.html">wx.getAvailableAudioSources()</a> 获取当前可用的音频源</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>录音的时长，单位 ms，最大值 600000（10 分钟）</td>
    </tr>
    <tr>
      <td>encodeBitRate</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>编码码率，有效值见下表格</td>
    </tr>
    <tr>
      <td>format</td>
      <td><code>&quot;mp3&quot; | &quot;aac&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>音频格式</td>
    </tr>
    <tr>
      <td>frameSize</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。</td>
    </tr>
    <tr>
      <td>numberOfChannels</td>
      <td><code>1 | 2</code></td>
      <td style="text-align:center">否</td>
      <td>录音通道数</td>
    </tr>
    <tr>
      <td>sampleRate</td>
      <td><code>8000 | 11025 | 12000 | 16000 | 22050 | 24000 | 32000 | 44100 | 48000</code></td>
      <td style="text-align:center">否</td>
      <td>采样率</td>
    </tr>
  </tbody>
</table>

### audioSource

指定录音的音频输入源

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>auto</td>
      <td>自动设置，默认使用手机麦克风，插上耳麦后自动切换使用耳机麦克风，所有平台适用</td>
    </tr>
    <tr>
      <td>buildInMic</td>
      <td>手机麦克风，仅限 iOS</td>
    </tr>
    <tr>
      <td>headsetMic</td>
      <td>耳机麦克风，仅限 iOS</td>
    </tr>
    <tr>
      <td>mic</td>
      <td>麦克风（没插耳麦时是手机麦克风，插耳麦时是耳机麦克风），仅限 Android</td>
    </tr>
    <tr>
      <td>camcorder</td>
      <td>同 mic，适用于录制音视频内容，仅限 Android</td>
    </tr>
    <tr>
      <td>voice_communication</td>
      <td>同 mic，适用于实时沟通，仅限 Android</td>
    </tr>
    <tr>
      <td>voice_recognition</td>
      <td>同 mic，适用于语音识别，仅限 Android</td>
    </tr>
  </tbody>
</table>

### format

音频格式

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mp3</td>
      <td>mp3 格式</td>
    </tr>
    <tr>
      <td>aac</td>
      <td>aac 格式</td>
    </tr>
  </tbody>
</table>

### numberOfChannels

录音通道数

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>1 个通道</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2 个通道</td>
    </tr>
  </tbody>
</table>

### sampleRate

采样率

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
      <th>编码码率</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>8000</td>
      <td>8000 采样率</td>
      <td><code>16000 ~ 48000</code></td>
    </tr>
    <tr>
      <td>11025</td>
      <td>11025 采样率</td>
      <td><code>16000 ~ 48000</code></td>
    </tr>
    <tr>
      <td>12000</td>
      <td>12000 采样率</td>
      <td><code>24000 ~ 64000</code></td>
    </tr>
    <tr>
      <td>16000</td>
      <td>16000 采样率</td>
      <td><code>24000 ~ 96000</code></td>
    </tr>
    <tr>
      <td>22050</td>
      <td>22050 采样率</td>
      <td><code>32000 ~ 128000</code></td>
    </tr>
    <tr>
      <td>24000</td>
      <td>24000 采样率</td>
      <td><code>32000 ~ 128000</code></td>
    </tr>
    <tr>
      <td>32000</td>
      <td>32000 采样率</td>
      <td><code>48000 ~ 192000</code></td>
    </tr>
    <tr>
      <td>44100</td>
      <td>44100 采样率</td>
      <td><code>64000 ~ 320000</code></td>
    </tr>
    <tr>
      <td>48000</td>
      <td>48000 采样率</td>
      <td><code>64000 ~ 320000</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RecorderManager.onError | ✔️ |  |  |
| RecorderManager.onFrameRecorded | ✔️ |  |  |
| RecorderManager.onInterruptionBegin | ✔️ |  |  |
| RecorderManager.onInterruptionEnd | ✔️ |  |  |
| RecorderManager.onPause | ✔️ |  |  |
| RecorderManager.onResume | ✔️ |  |  |
| RecorderManager.onStart | ✔️ |  |  |
| RecorderManager.onStop | ✔️ |  |  |
| RecorderManager.pause | ✔️ |  |  |
| RecorderManager.resume | ✔️ |  |  |
| RecorderManager.start | ✔️ |  |  |
| RecorderManager.stop | ✔️ |  |  |
