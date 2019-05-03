---
title: 音频播放控制
sidebar_label: 音频播放控制
---

## Taro.playVoice(OBJECT)

使用方式同 [`wx.playVoice`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.playVoice.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.playVoice(params).then(...)
```

## Taro.pauseVoice()

暂停正在播放的语音。再次调用 Taro.playVoice 播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 Taro.stopVoice。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startRecord(params)
  .then(res => {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.pauseVoice, 5000)
  })
```

## Taro.stopVoice

结束播放语音。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startRecord(params)
  .then(res => {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.stopVoice, 5000)
  })
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.playVoice | ✔️ |  |  |  |  |
| Taro.pauseVoice | ✔️ |  |  |  |  |
| Taro.stopVoice | ✔️ |  |  |  |  |


# 音频组件控制

## Taro.createAudioContext(audioId, this.$scope)

使用方式同 [`wx.createAudioContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createAudioContext.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const audioCtx = Taro.createAudioContext('myAudio')
```

## Taro.createInnerAudioContext()

使用方式同 [`wx.createInnerAudioContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createInnerAudioContext.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const innerAudioContext = Taro.createInnerAudioContext()
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.createAudioContext | ✔️ |  |  |
| Taro.createInnerAudioContext | ✔️ | ✔️ |  |
