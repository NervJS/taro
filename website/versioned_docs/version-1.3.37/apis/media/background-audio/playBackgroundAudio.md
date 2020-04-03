---
title: Taro.playBackgroundAudio(option)
sidebar_label: playBackgroundAudio
id: version-1.3.37-playBackgroundAudio
original_id: playBackgroundAudio
---

使用后台播放器播放音乐，对于微信客户端来说，只能同时有一个后台音乐在播放。当用户离开小程序后，音乐将暂停播放；当用户点击“显示在聊天顶部”时，音乐不会暂停播放；当用户在其他小程序占用了音乐播放器，原有小程序内的音乐将停止播放。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.playBackgroundAudio.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| dataUrl | `string` | 是 | 音乐链接，目前支持的格式有 m4a, aac, mp3, wav |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| coverImgUrl | `string` | 否 | 封面URL |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| title | `string` | 否 | 音乐标题 |

## 示例代码

```tsx
Taro.playBackgroundAudio({
  dataUrl: '',
  title: '',
  coverImgUrl: ''
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.playBackgroundAudio | ✔️ |  |  |
