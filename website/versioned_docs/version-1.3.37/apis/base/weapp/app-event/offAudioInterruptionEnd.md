---
title: Taro.offAudioInterruptionEnd(callback)
sidebar_label: offAudioInterruptionEnd
id: version-1.3.37-offAudioInterruptionEnd
original_id: offAudioInterruptionEnd
---

取消监听音频中断结束事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAudioInterruptionEnd.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | 音频中断结束事件的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offAudioInterruptionEnd | ✔️ |  |  |
