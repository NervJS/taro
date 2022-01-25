---
title: Taro.onCompassChange(callback)
sidebar_label: onCompassChange
---

监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 Taro.stopCompass 停止监听。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.onCompassChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 罗盘数据变化事件的回调函数 |

### Callback

罗盘数据变化事件的回调函数

```tsx
(result: OnCompassChangeCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnCompassChangeCallbackResult` |

### OnCompassChangeCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| accuracy | string or number | 精度<br /><br />由于平台差异，accuracy 在 iOS/Android 的值不同。<br /><br />- iOS：accuracy 是一个 number 类型的值，表示相对于磁北极的偏差。0 表示设备指向磁北，90 表示指向东，180 表示指向南，依此类推。<br />- Android：accuracy 是一个 string 类型的枚举值。 |
| direction | `number` | 面对的方向度数 |

### accuracy

| 参数 | 说明 |
| --- | --- |
| high | 高精度 |
| medium | 中等精度 |
| low | 低精度 |
| no-contact | 不可信，传感器失去连接 |
| unreliable | 不可信，原因未知 |
| unknow ${value} | 未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值 |

## 示例代码

```tsx
Taro.onCompassChange(function (res) {
  console.log(res.direction)
})
```
