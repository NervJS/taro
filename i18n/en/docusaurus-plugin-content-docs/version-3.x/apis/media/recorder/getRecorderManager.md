---
title: Taro.getRecorderManager()
sidebar_label: getRecorderManager
---

Obtains the **globally unique** recording manager RecorderManager.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/recorder/wx.getRecorderManager.html)

## Type

```tsx
() => RecorderManager
```

## Parameters

## Sample Code

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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getRecorderManager | ✔️ |  | ✔️ |
