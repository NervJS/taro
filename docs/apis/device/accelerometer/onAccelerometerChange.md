---
title: Taro.onAccelerometerChange(callback)
sidebar_label: onAccelerometerChange
---

监听加速度数据事件。频率根据 `startAccelerometer()` 的 `interval` 参数。可使用 `stopAccelerometer()` 停止监听。

<!-- 使用方式同 [`wx.onAccelerometerChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onAccelerometerChange.html)。 -->

## 参数

### function callback(res)

加速度数据事件的回调函数。

#### 参数

##### object res

| Name | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X 轴 |
| y | <code>number</code> | Y 轴 |
| z | <code>number</code> | Z 轴 |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.onAccelerometerChange(res => {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onAccelerometerChange | ✔️ | ✔️ |  ✔️ |

