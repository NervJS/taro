---
title: Taro.stopVoice()
sidebar_label: stopVoice
---


结束播放语音。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.startRecord(params)
  .then(res => {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.stopVoice, 5000)
  })
```



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.stopVoice | ✔️ |  |  |  |  |



