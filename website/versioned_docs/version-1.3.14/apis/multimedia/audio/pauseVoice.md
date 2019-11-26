---
title: Taro.pauseVoice()
sidebar_label: pauseVoice
id: version-1.3.14-pauseVoice
original_id: pauseVoice
---


暂停正在播放的语音。再次调用 Taro.playVoice 播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 Taro.stopVoice。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.startRecord(params)
  .then(res => {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.pauseVoice, 5000)
  })
```



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.pauseVoice | ✔️ |  |  |  |  |



