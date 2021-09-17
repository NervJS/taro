---
title: Taro.createInnerAudioContext()
sidebar_label: createInnerAudioContext
---

Creates the context `InnerAudioContext` object for an internal audio.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/wx.createInnerAudioContext.html)

## Type

```tsx
() => InnerAudioContext
```

## Parameters

## Sample Code

```tsx
const innerAudioContext = Taro.createInnerAudioContext()
innerAudioContext.autoplay = true
innerAudioContext.src = 'https://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
innerAudioContext.onPlay(() => {
  console.log('Start playback')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createInnerAudioContext | ✔️ | ✔️ | ✔️ |
