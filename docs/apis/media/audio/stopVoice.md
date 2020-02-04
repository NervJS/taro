---
title: Taro.stopVoice(option)
sidebar_label: stopVoice
---

结束播放语音。
**注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.stopVoice.html)

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

### 示例 1

```tsx
Taro.startRecord({
  success: function (res) {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.stopVoice, 5000)
  }
})
```

### 示例 2

```tsx
Taro.startRecord(params).then(res => {
  const filePath = res.tempFilePath
  Taro.playVoice({ filePath })

  setTimeout(Taro.stopVoice, 5000)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.stopVoice | ✔️ |  |  |
