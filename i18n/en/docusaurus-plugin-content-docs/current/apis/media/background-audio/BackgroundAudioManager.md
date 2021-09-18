---
title: BackgroundAudioManager
sidebar_label: BackgroundAudioManager
---

The BackgroundAudioManager instance can be obtained through the API [Taro.getBackgroundAudioManager](./getBackgroundAudioManager.md).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/background-audio/BackgroundAudioManager.html)

## Methods

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Read only</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>buffered</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The position where the audio is buffered. Only the part between the position where the playback has got to and this position is buffered (read only).</td>
    </tr>
    <tr>
      <td>coverImgUrl</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The cover image URL used as the background image of the native audio player. It is also used in the card image and background shared via the native audio player.</td>
    </tr>
    <tr>
      <td>currentTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The position where the playback has got to (in sec). It is only returned when a valid src attribute exists (read only).</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The length of the audio file (in sec), which is only returned when a valid src attribute exists (read only).</td>
    </tr>
    <tr>
      <td>epname</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The album name, which is also used in the card description shared via the native audio player.</td>
    </tr>
    <tr>
      <td>paused</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Whether the playback is paused or stopped (read only).</td>
    </tr>
    <tr>
      <td>protocol</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The protocol used for audio transfer. It is 'http' by default. You can set it to 'hls' for the live stream audio transferred over HLS protocol.</td>
    </tr>
    <tr>
      <td>singer</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The singer name, which is also used in the card description shared via the native audio player.</td>
    </tr>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates the audio data source (Cloud file ID is supported as of base library 2.2.3). It is an empty string by default. <strong>When a new src attribute is configured, the audio file is played automatically.</strong> M4a, AAC, MP3, and WAV file formates are supported.</td>
    </tr>
    <tr>
      <td>startTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The position where the audio playback starts (in sec).</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The title of an audio file in the native audio player (required). It is also used as the card title shared via the native audio player.</td>
    </tr>
    <tr>
      <td>webUrl</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The page URL, which is also used in the card description shared via the native audio player.</td>
    </tr>
  </tbody>
</table>

### play

Plays music.

```tsx
() => void
```

### pause

Pauses music.

```tsx
() => void
```

### stop

Stops music.

```tsx
() => void
```

### seek

Jumps to the specific position.

```tsx
(position: any) => void
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

Listens on the background audio playback event.

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

Listens on the event of pausing the playback of a background audio file.

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

Listens on the event of stopping the playback of a background audio file.

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

Listens on the event of playing an background audio file to the end without interruption.

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

Listens on the event of updating the background audio playback progress. A callback is executed only if the Mini Program is running at the foreground.

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

### onPrev

Listens on the event of tapping the previous song on the system's music player panel (for iOS only).

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

### onNext

Listens on the event of tapping the next song on the system's music player panel (for iOS only).

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

Listens on the background audio playback error event.

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

## Sample Code

```tsx
const backgroundAudioManager = Taro.getBackgroundAudioManager()
backgroundAudioManager.title = 'At this Very Moment'
backgroundAudioManager.epname = 'At this Very Moment'
backgroundAudioManager.singer = 'Xu Wei'
backgroundAudioManager.coverImgUrl = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
// Plays automatically after src is set
backgroundAudioManager.src = 'https://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
```
