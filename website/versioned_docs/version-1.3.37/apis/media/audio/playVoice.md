---
title: Taro.playVoice(option)
sidebar_label: playVoice
id: version-1.3.37-playVoice
original_id: playVoice
---

开始播放语音。同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.playVoice.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 需要播放的语音文件的文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| duration | `number` | 否 | 指定录音时长，到达指定的录音时长后会自动停止录音，单位：秒 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.startRecord({
  success: function (res) {
    const tempFilePath = res.tempFilePath
    Taro.playVoice({
      filePath: tempFilePath,
      complete: function () { }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.playVoice | ✔️ |  |  |
