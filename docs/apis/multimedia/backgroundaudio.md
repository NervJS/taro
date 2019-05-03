---
title: 背景音频
sidebar_label: 背景音频
---

## Taro.getBackgroundAudioPlayerState(OBJECT)

使用方式同 [`wx.getBackgroundAudioPlayerState`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBackgroundAudioPlayerState.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBackgroundAudioPlayerState(params).then(...)
```

## Taro.playBackgroundAudio(OBJECT)

使用方式同 [`wx.playBackgroundAudio`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.playBackgroundAudio.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.playBackgroundAudio(params).then(...)
```

## Taro.pauseBackgroundAudio()

暂停播放音乐。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.pauseBackgroundAudio()
```

## Taro.seekBackgroundAudio(OBJECT)

使用方式同 [`wx.seekBackgroundAudio`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.seekBackgroundAudio.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.seekBackgroundAudio(params).then(...)
```

## Taro.stopBackgroundAudio()

停止播放音乐。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopBackgroundAudio()
```

## Taro.onBackgroundAudioPlay(CALLBACK)

监听音乐播放。

## Taro.onBackgroundAudioPause(CALLBACK)

监听音乐暂停。

## Taro.onBackgroundAudioStop(CALLBACK)

监听音乐停止。

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.getBackgroundAudioPlayerState | ✔️ |  |  |
| Taro.playBackgroundAudio | ✔️ |  |  |
| Taro.pauseBackgroundAudio | ✔️ |  |  |
| Taro.seekBackgroundAudio | ✔️ |  |  |
| Taro.stopBackgroundAudio | ✔️ |  |  |
| Taro.onBackgroundAudioPlay | ✔️ |  |  |
| Taro.onBackgroundAudioPause | ✔️ |  |  |
| Taro.onBackgroundAudioStop | ✔️ |  |  |

# 背景音频播放管理

## Taro.getBackgroundAudioManager()

使用方式同 [`wx.getBackgroundAudioManager`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBackgroundAudioManager.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const backgroundAudioManager = Taro.getBackgroundAudioManager()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getBackgroundAudioManager | ✔️ |  |  |
