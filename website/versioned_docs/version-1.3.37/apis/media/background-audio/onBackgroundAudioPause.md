---
title: Taro.onBackgroundAudioPause(callback)
sidebar_label: onBackgroundAudioPause
id: version-1.3.37-onBackgroundAudioPause
original_id: onBackgroundAudioPause
---

监听音乐暂停。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioPause.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | 音乐暂停事件的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBackgroundAudioPause | ✔️ |  |  |
