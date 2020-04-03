---
title: MediaContainer
sidebar_label: MediaContainer
id: version-1.3.37-MediaContainer
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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| track | `MediaTrack` | 要添加的音频或视频轨道 |

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

| 参数 | 类型 |
| --- | --- |
| option | `ExtractDataSourceOption` |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| track | `MediaTrack` | 要移除的音频或视频轨道 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.removeTrack | ✔️ |  |  |

## 参数

### ExtractDataSourceOption

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| source | `string` | 视频源地址，只支持本地文件 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer.addTrack | ✔️ |  |  |
| MediaContainer.destroy | ✔️ |  |  |
| MediaContainer.export | ✔️ |  |  |
| MediaContainer.extractDataSource | ✔️ |  |  |
| MediaContainer.removeTrack | ✔️ |  |  |
