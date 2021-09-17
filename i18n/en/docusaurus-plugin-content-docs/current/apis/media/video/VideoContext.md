---
title: VideoContext
sidebar_label: VideoContext
---

## Methods

### exitFullScreen

Exits the full screen

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.exitFullScreen.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.exitFullScreen | ✔️ |  | ✔️ |

### hideStatusBar

Hides the status bar (only effective in full screen mode on iOS)

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.hideStatusBar.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.hideStatusBar | ✔️ |  |  |

### pause

Pauses the video.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.pause.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.pause | ✔️ |  | ✔️ |

### play

Plays the video.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.play.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.play | ✔️ |  | ✔️ |

### playbackRate

Sets multi-speed playback.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.playbackRate.html)

```tsx
(rate: number) => void
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
      <td>rate</td>
      <td><code>number</code></td>
      <td>Indicates the playback speed (0.5x/0.8x/1x/1.25x/1.5x). 2.0x is supported as of V2.6.3.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.playbackRate | ✔️ |  | ✔️ |

### requestFullScreen

Enters the full screen.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.requestFullScreen.html)

```tsx
(option: RequestFullScreenOption) => void
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
      <td><code>RequestFullScreenOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.requestFullScreen | ✔️ |  | ✔️ |

### seek

Jumps to the specific position.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.seek.html)

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
      <td>The position to be jumped to (in sec)</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.seek | ✔️ |  | ✔️ |

### sendDanmu

Sends barrage comments

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.sendDanmu.html)

```tsx
(data: Danmu) => void
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
      <td>data</td>
      <td><code>Danmu</code></td>
      <td>Barrage comment text</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.sendDanmu | ✔️ |  |  |

### showStatusBar

Displays the status bar (only effective in full screen mode on iOS)

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.showStatusBar.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.showStatusBar | ✔️ |  |  |

### stop

Stops the video.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.stop.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.stop | ✔️ |  | ✔️ |

## Parameters

### RequestFullScreenOption

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
      <td>direction</td>
      <td><code>0 | 90 | -90</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the direction of the video in the full screen. If it is not specified, the direction is set automatically based on the aspect ratio.</td>
    </tr>
  </tbody>
</table>

### Danmu

Barrage comments

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
      <td>text</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Barrage comment text</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Color of barrage comments</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.exitFullScreen | ✔️ |  | ✔️ |
| VideoContext.hideStatusBar | ✔️ |  |  |
| VideoContext.pause | ✔️ |  | ✔️ |
| VideoContext.play | ✔️ |  | ✔️ |
| VideoContext.playbackRate | ✔️ |  | ✔️ |
| VideoContext.requestFullScreen | ✔️ |  | ✔️ |
| VideoContext.seek | ✔️ |  | ✔️ |
| VideoContext.sendDanmu | ✔️ |  |  |
| VideoContext.showStatusBar | ✔️ |  |  |
| VideoContext.stop | ✔️ |  | ✔️ |
