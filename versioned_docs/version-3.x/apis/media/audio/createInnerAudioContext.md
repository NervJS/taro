---
title: Taro.createInnerAudioContext()
sidebar_label: createInnerAudioContext
---

创建内部 audio 上下文 InnerAudioContext 对象。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html)

## 类型

```tsx
() => InnerAudioContext
```

## 参数

## 示例代码

```tsx
const innerAudioContext = Taro.createInnerAudioContext()
innerAudioContext.autoplay = true
innerAudioContext.src = 'https://storage.360buyimg.com/jdrd-blog/27.mp3'
innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createInnerAudioContext | ✔️ | ✔️ | ✔️ |
