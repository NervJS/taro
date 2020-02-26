---
title: Taro.onBackgroundAudioStop(callback)
sidebar_label: onBackgroundAudioStop
---

监听音乐停止。

**bug & tip：**

1.  `bug`: `iOS` `6.3.30` Taro.seekBackgroundAudio 会有短暂延迟

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioStop.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | 音乐停止事件的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBackgroundAudioStop | ✔️ |  |  |
