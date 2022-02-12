---
title: MediaContainer
sidebar_label: MediaContainer
---

创建音视频处理容器，最终可将容器中的轨道合成一个视频

> 可通过 [Taro.createMediaContainer](./createMediaContainer) 创建

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.html)

## 方法

### addTrack

将音频或视频轨道添加到容器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.addTrack.html)

```tsx
(track: MediaTrack) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| track | `MediaTrack` | 要添加的音频或视频轨道 |

### destroy

将容器销毁，释放资源

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.destroy.html)

```tsx
() => void
```

### export

将容器内的轨道合并并导出视频文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.export.html)

```tsx
() => void
```

### extractDataSource

将传入的视频源分离轨道。不会自动将轨道添加到待合成的容器里。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.extractDataSource.html)

```tsx
(option: ExtractDataSourceOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ExtractDataSourceOption` |

### removeTrack

将音频或视频轨道从容器中移除

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.removeTrack.html)

```tsx
(track: MediaTrack) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| track | `MediaTrack` | 要移除的音频或视频轨道 |

## 参数

### ExtractDataSourceOption

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| source | `string` | 视频源地址，只支持本地文件 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaContainer | ✔️ |  |  |
| MediaContainer.addTrack | ✔️ |  |  |
| MediaContainer.destroy | ✔️ |  |  |
| MediaContainer.export | ✔️ |  |  |
| MediaContainer.extractDataSource | ✔️ |  |  |
| MediaContainer.removeTrack | ✔️ |  |  |
