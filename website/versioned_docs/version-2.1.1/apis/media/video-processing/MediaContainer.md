---
title: MediaContainer
sidebar_label: MediaContainer
id: version-2.1.1-MediaContainer
original_id: MediaContainer
---

创建音视频处理容器，最终可将容器中的轨道合成一个视频

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.html)

## 方法

### addTrack

将音频或视频轨道添加到容器

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.addTrack.html)

```tsx
(track: MediaTrack) => void
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
      <td>track</td>
      <td><code>MediaTrack</code></td>
      <td>要添加的音频或视频轨道</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.addTrack | ✔️ |  |  |

### destroy

将容器销毁，释放资源

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.destroy.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.destroy | ✔️ |  |  |

### export

将容器内的轨道合并并导出视频文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.export.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.export | ✔️ |  |  |

### extractDataSource

将传入的视频源分离轨道。不会自动将轨道添加到待合成的容器里。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.extractDataSource.html)

```tsx
(option: ExtractDataSourceOption) => void
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
      <td><code>ExtractDataSourceOption</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.extractDataSource | ✔️ |  |  |

### removeTrack

将音频或视频轨道从容器中移除

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.removeTrack.html)

```tsx
(track: MediaTrack) => void
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
      <td>track</td>
      <td><code>MediaTrack</code></td>
      <td>要移除的音频或视频轨道</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.removeTrack | ✔️ |  |  |

## 参数

### ExtractDataSourceOption

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
      <td>source</td>
      <td><code>string</code></td>
      <td>视频源地址，只支持本地文件</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.addTrack | ✔️ |  |  |
| MediaContainer.destroy | ✔️ |  |  |
| MediaContainer.export | ✔️ |  |  |
| MediaContainer.extractDataSource | ✔️ |  |  |
| MediaContainer.removeTrack | ✔️ |  |  |
