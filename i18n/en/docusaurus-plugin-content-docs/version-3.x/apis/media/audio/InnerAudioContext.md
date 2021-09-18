---
title: InnerAudioContext
sidebar_label: InnerAudioContext
---

The InnerAudioContext instance can be obtained through the API `Taro.createInnerAudioContext`.

**Supported Formats**

| Format | iOS  | Android |
| ---- | ---- | ------- |
| flac | x    | √       |
| m4a  | √    | √       |
| ogg  | x    | √       |
| ape  | x    | √       |
| amr  | x    | √       |
| wma  | x    | √       |
| wav  | √    | √       |
| mp3  | √    | √       |
| mp4  | x    | √       |
| aac  | √    | √       |
| aiff | √    | x       |
| caf  | √    | x       |

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/InnerAudioContext.html)

## Methods

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>autoplay</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Whether to enable auto playback.</td>
    </tr>
    <tr>
      <td>buffered</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The position where the audio is buffered. Only the part between the position where the playback has got to and this position is buffered (read only).</td>
    </tr>
    <tr>
      <td>currentTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The position where the playback has got to (in sec). It is only returned when a valid src attribute exists and is rounded to six decimal places (read only).</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The length of the audio file (in sec). It is only returned when a valid src attribute exists (read only).</td>
    </tr>
    <tr>
      <td>loop</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Whether to enable loop playback.</td>
    </tr>
    <tr>
      <td>obeyMuteSwitch</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Whether to follow the "Mute" switch. If it is set to <code>false</code>,  the audio file still sounds even if the "Mute" switch is on. As of base library 2.3.0, this parameter does not take effect and the feature is set through the API <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.setInnerAudioOption.html">Taro.setInnerAudioOption</a>.</td>
    </tr>
    <tr>
      <td>paused</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Whether the playback is paused or stopped (read only).</td>
    </tr>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The audio file address which can be used to play the audio file directly.</td>
    </tr>
    <tr>
      <td>startTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The position where the playback starts (in sec).</td>
    </tr>
    <tr>
      <td>volume</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the volume, which ranges from 0 to 1. It is 1 by default.</td>
    </tr>
  </tbody>
</table>

### play

Plays an audio file.

```tsx
() => void
```

### pause

Pauses the audio playback. The playback is resumed at the point where it was paused.

```tsx
() => void
```

### stop

Stops the audio playback. The playback starts from the beginning if the file is played again.

```tsx
() => void
```

### seek

Jumps to the specific position.

```tsx
(position: number) => void
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
      <td>position</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

### destroy

Terminates the current instance.

```tsx
() => void
```

### onCanplay

Listens on the event that an audio file is ready for playback. A smooth playback is not guaranteed.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onPlay

Listens on the audio playback event.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onPause

Listens on the audio pause event.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onStop

Listens on the event of stopping audio playback.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onEnded

Listens on the event of playing an audio file to the end without interruption.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onTimeUpdate

Listens on the event of updating audio playback progress.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onError

Listens on the audio playback error event.

```tsx
(callback?: (res: onErrorDetail) => void) => void
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
      <td>callback</td>
      <td><code>(res: onErrorDetail) =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onWaiting

Listens on the audio loading event. It is triggered when the playback of an audio file stops to load the file due to insufficient data.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onSeeking

Listens on the event of jumping to a specific position in the audio file.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onSeeked

Listens on the event of finishing the jump to a specific position in the audio file.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offCanplay

Un-listens on the event that an audio file is ready for playback.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offPlay

Un-listens on the audio playback event.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offPause

Un-listens on the audio pause event.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offStop

Un-listens on the event of stopping audio playback.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offEnded

Un-listens on the event of playing an audio file to the end without interruption.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offTimeUpdate

Un-listens on the event of updating audio playback progress.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offError

Un-listens on the audio playback error event.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offWaiting

Un-listens on the audio loading event.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offSeeking

Un-listens on the event of jumping to a specific position in the audio file.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offSeeked

Un-listens on the event of finishing the jump to a specific position in the audio file.

```tsx
(callback?: () => void) => void
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
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

## Parameters

### onErrorDetail

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
      <td>errCode</td>
      <td><code>number</code></td>
      <td>Error code</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
  </tbody>
</table>

### onErrorDetailErrCode

Valid values of errCode

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>10001</td>
      <td>System error</td>
    </tr>
    <tr>
      <td>10002</td>
      <td>Network error</td>
    </tr>
    <tr>
      <td>10003</td>
      <td>File error</td>
    </tr>
    <tr>
      <td>10004</td>
      <td>Format error</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>Unknown error</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const innerAudioContext = Taro.createInnerAudioContext()
innerAudioContext.autoplay = true
innerAudioContext.src = 'https://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
innerAudioContext.onPlay(() => {
  console.log('Start playback')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})
```
## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InnerAudioContext.play | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.pause | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.stop | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.seek | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.destroy | ✔️ | ✔️ |  |
| InnerAudioContext.onCanplay | ✔️ |  | ✔️ |
| InnerAudioContext.onPlay | ✔️ |  | ✔️ |
| InnerAudioContext.onPause | ✔️ |  | ✔️ |
| InnerAudioContext.onStop | ✔️ |  | ✔️ |
| InnerAudioContext.onEnded | ✔️ |  | ✔️ |
| InnerAudioContext.onTimeUpdate | ✔️ |  | ✔️ |
| InnerAudioContext.onError | ✔️ |  | ✔️ |
| InnerAudioContext.onWaiting | ✔️ |  | ✔️ |
| InnerAudioContext.onSeeking | ✔️ |  | ✔️ |
| InnerAudioContext.onSeeked | ✔️ |  | ✔️ |
| InnerAudioContext.offCanplay | ✔️ |  | ✔️ |
| InnerAudioContext.offPlay | ✔️ |  | ✔️ |
| InnerAudioContext.offPause | ✔️ |  | ✔️ |
| InnerAudioContext.offStop | ✔️ |  | ✔️ |
| InnerAudioContext.offEnded | ✔️ |  | ✔️ |
| InnerAudioContext.offTimeUpdate | ✔️ |  | ✔️ |
| InnerAudioContext.offError | ✔️ |  | ✔️ |
| InnerAudioContext.offWaiting | ✔️ |  | ✔️ |
| InnerAudioContext.offSeeking | ✔️ |  | ✔️ |
| InnerAudioContext.offSeeked | ✔️ |  | ✔️ |
