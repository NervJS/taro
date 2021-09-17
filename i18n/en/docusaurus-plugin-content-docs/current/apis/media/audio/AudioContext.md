---
title: AudioContext
sidebar_label: AudioContext
---

The `AudioContext` instance can be obtained through `Taro.createAudioContext`.
`AudioContext` is bound to an audio component with an id, to work with the audio component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/AudioContext.html)

## Methods

### pause

Pauses the audio playback.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/AudioContext.pause.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AudioContext.pause | ✔️ |  |  |

### play

Plays an audio file.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/AudioContext.play.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AudioContext.play | ✔️ |  |  |

### seek

Jumps to the specific position in the audio file.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/AudioContext.seek.html)

```tsx
(position: number) => void
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
      <td>position</td>
      <td><code>number</code></td>
      <td>The position where the playback will jump to in the audio file (in sec).</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AudioContext.seek | ✔️ |  |  |

### setSrc

Sets an audio file address.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/AudioContext.setSrc.html)

```tsx
(src: string) => void
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
      <td>src</td>
      <td><code>string</code></td>
      <td>Audio file address</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AudioContext.setSrc | ✔️ |  |  |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AudioContext.pause | ✔️ |  |  |
| AudioContext.play | ✔️ |  |  |
| AudioContext.seek | ✔️ |  |  |
| AudioContext.setSrc | ✔️ |  |  |
