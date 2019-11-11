---
title: Taro.onUserCaptureScreen(CALLBACK)
sidebar_label: onUserCaptureScreen
---


监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.onUserCaptureScreen(() => {
    console.log('用户截屏了')
})
```

## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onUserCaptureScreen | ✔️ |  |  |

