---
title: Taro.getRecorderManager()
sidebar_label: getRecorderManager
id: version-1.3.37-getRecorderManager
original_id: getRecorderManager
---

获取**全局唯一**的录音管理器 RecorderManager

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.getRecorderManager.html)

## 类型

```tsx
() => RecorderManager
```

## 参数

## 示例代码

```tsx
const recorderManager = Taro.getRecorderManager()
recorderManager.onStart(() => {
  console.log('recorder start')
})
recorderManager.onPause(() => {
  console.log('recorder pause')
})
recorderManager.onStop((res) => {
  console.log('recorder stop', res)
  const { tempFilePath } = res
})
recorderManager.onFrameRecorded((res) => {
  const { frameBuffer } = res
  console.log('frameBuffer.byteLength', frameBuffer.byteLength)
})
const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
}
recorderManager.start(options)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getRecorderManager | ✔️ |  |  |
