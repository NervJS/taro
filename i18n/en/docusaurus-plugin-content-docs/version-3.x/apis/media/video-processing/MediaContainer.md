---
title: MediaContainer
sidebar_label: MediaContainer
---

Create an audio/video processing container, which can eventually be used to combine the tracks in the container into a single video.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.html)

## Methods

### addTrack

Adding an audio or video track to a container.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.addTrack.html)

```tsx
(track: MediaTrack) => void
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
      <td>track</td>
      <td><code>MediaTrack</code></td>
      <td>Audio or video track to be added</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.addTrack | ✔️ |  |  |

### destroy

Destroy the container and release the resources

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video-processing/MediaContainer.destroy.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.destroy | ✔️ |  |  |

### export

Merge the tracks in the container and export the video file

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video-processing/MediaContainer.export.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.export | ✔️ |  |  |

### extractDataSource

Separates tracks from the incoming video source. Does not automatically add tracks to the container to be composited.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video-processing/MediaContainer.extractDataSource.html)

```tsx
(option: ExtractDataSourceOption) => void
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
      <td><code>ExtractDataSourceOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.extractDataSource | ✔️ |  |  |

### removeTrack

Remove the audio or video track from the container.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video-processing/MediaContainer.removeTrack.html)

```tsx
(track: MediaTrack) => void
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
      <td>track</td>
      <td><code>MediaTrack</code></td>
      <td>Audio or video track to be removed</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.removeTrack | ✔️ |  |  |

## Parameters

### ExtractDataSourceOption

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
      <td>source</td>
      <td><code>string</code></td>
      <td>Video source address, local file support only</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.addTrack | ✔️ |  |  |
| MediaContainer.destroy | ✔️ |  |  |
| MediaContainer.export | ✔️ |  |  |
| MediaContainer.extractDataSource | ✔️ |  |  |
| MediaContainer.removeTrack | ✔️ |  |  |
