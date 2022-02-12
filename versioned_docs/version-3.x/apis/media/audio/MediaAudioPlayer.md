---
title: MediaAudioPlayer
sidebar_label: MediaAudioPlayer
---

MediaAudioPlayer 实例，可通过 [Taro.createMediaAudioPlayer](./createMediaAudioPlayer) 接口获取实例。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.html)

## 方法

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | :---: | --- |
| volume | `number` | `1` | 音量。范围 0~1 |

### start

启动播放器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.start.html)

```tsx
() => Promise<void>
```

### addAudioSource

添加音频源

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.addAudioSource.html)

```tsx
(source: VideoDecoder) => Promise<void>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| source | `VideoDecoder` | 视频解码器实例。作为音频源添加到音频播放器中 |

### removeAudioSource

移除音频源

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.removeAudioSource.html)

```tsx
(source: VideoDecoder) => Promise<void>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| source | `VideoDecoder` | 视频解码器实例 |

### stop

停止播放器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.stop.html)

```tsx
() => Promise<void>
```

### destroy

销毁播放器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.destroy.html)

```tsx
() => Promise<void>
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaAudioPlayer | ✔️ |  |  |
| MediaAudioPlayer.start | ✔️ |  |  |
| MediaAudioPlayer.addAudioSource | ✔️ |  |  |
| MediaAudioPlayer.removeAudioSource | ✔️ |  |  |
| MediaAudioPlayer.stop | ✔️ |  |  |
| MediaAudioPlayer.destroy | ✔️ |  |  |
