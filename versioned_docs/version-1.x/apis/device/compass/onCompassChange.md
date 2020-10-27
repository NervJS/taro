---
title: Taro.onCompassChange(callback)
sidebar_label: onCompassChange
---

监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 wx.stopCompass 停止监听。

使用方式同 [`wx.onCompassChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onCompassChange.html)。

## 参数

### callback(res)

#### 参数

##### object res

| Name | Type | Description |
| --- | --- | --- |
| direction | <code>number</code> | 面对的方向度数 |
| accuracy | <code>&#x27;high&#x27;</code> / <code>&#x27;medium&#x27;</code> / <code>&#x27;low&#x27;</code> / <code>&#x27;no-contact&#x27;</code> / <code>&#x27;unreliable&#x27;</code> / <code>&#x27;unknow&#x27;</code> / <code>number</code> | 精度 |

**由于平台差异，accuracy 在 iOS/Android 的值不同。**

* iOS：accuracy 是一个 number 类型的值，表示相对于磁北极的偏差。0 表示设备指向磁北，90 表示指向东，180 表示指向南，依此类推。
* Android：accuracy 是一个 string 类型的枚举值。
  - **high**: 高精度
  - **medium**: 中等精度
  - **low**: 低精度
  - **no-contact**: 不可信，传感器失去连接
  - **unreliable**: 不可信，原因未知
  - **unknow ${value}**: 未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.onCompassChange(res => {
  console.log(res.direction)
})
```

## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onCompassChange | ✔️ | ✔️ |  |

