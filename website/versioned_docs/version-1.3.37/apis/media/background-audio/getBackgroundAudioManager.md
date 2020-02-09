---
title: Taro.getBackgroundAudioManager()
sidebar_label: getBackgroundAudioManager
id: version-1.3.37-getBackgroundAudioManager
original_id: getBackgroundAudioManager
---

获取**全局唯一**的背景音频管理器。
小程序切入后台，如果音频处于播放状态，可以继续播放。但是后台状态不能通过调用API操纵音频的播放状态。

从微信客户端6.7.2版本开始，若需要在小程序切后台后继续播放音频，需要在 [app.json](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html) 中配置 `requiredBackgroundModes` 属性。开发版和体验版上可以直接生效，正式版还需通过审核。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html)

## 类型

```tsx
() => BackgroundAudioManager
```

## 参数

## 示例代码

```tsx
const backgroundAudioManager = Taro.getBackgroundAudioManager()
backgroundAudioManager.title = '此时此刻'
backgroundAudioManager.epname = '此时此刻'
backgroundAudioManager.singer = '许巍'
backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46' // 设置了 src 之后会自动播放
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBackgroundAudioManager | ✔️ |  |  |
