---
title: Taro.onGyroscopeChange(callback)
sidebar_label: onGyroscopeChange
---

监听陀螺仪数据变化事件。频率根据 Taro.startGyroscope() 的 interval 参数。可以使用 Taro.stopGyroscope() 停止监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.onGyroscopeChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

陀螺仪数据变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | x 轴的角速度 |
| y | `number` | y 轴的角速度 |
| z | `number` | z 轴的角速度 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onGyroscopeChange | ✔️ |  |  |
