---
title: Taro.pauseBackgroundAudio(option)
sidebar_label: pauseBackgroundAudio
id: version-1.3.37-pauseBackgroundAudio
original_id: pauseBackgroundAudio
---

暂停播放音乐。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.pauseBackgroundAudio.html)

## 类型

```tsx
(option?: Option) => void
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.pauseBackgroundAudio()
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.pauseBackgroundAudio | ✔️ |  |  |
