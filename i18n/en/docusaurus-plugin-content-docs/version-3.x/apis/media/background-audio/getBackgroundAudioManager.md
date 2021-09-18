---
title: Taro.getBackgroundAudioManager()
sidebar_label: getBackgroundAudioManager
---

Obtains the **globally unique** background audio manager. The playback of an audio file continues when the Mini Program is switched to the background. However, the audio playback status at the background cannot be controlled by calling an API.

As of WeChat 6.7.2, you need to configure the `requiredBackgroundModes` attribute in [app.json](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html) in order to continue playing an audio file after the Mini Program switches to the background. This property takes effect directly in the developer and demo versions, but must be approved before working in the official version.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/background-audio/wx.getBackgroundAudioManager.html)

## Type

```tsx
() => BackgroundAudioManager
```

## Parameters

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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBackgroundAudioManager | ✔️ |  |  |
