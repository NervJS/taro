---
title: 加速度计
sidebar_label: 加速度计
---

## Taro.onAccelerometerChange(CALLBACK)

使用方式同 [`wx.onAccelerometerChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onAccelerometerChange.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onAccelerometerChange(res => {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

## Taro.startAccelerometer(OBJECT)

使用方式同 [`wx.startAccelerometer`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startAccelerometer.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startAccelerometer({ interval: 'game' })
```

## Taro.stopAccelerometer(OBJECT)

使用方式同 [`wx.stopAccelerometer`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopAccelerometer.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopAccelerometer()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onAccelerometerChange | ✔️ | ✔️ |  |
| Taro.startAccelerometer | ✔️ | ✔️ |  |
| Taro.stopAccelerometer | ✔️ | ✔️ |  |

