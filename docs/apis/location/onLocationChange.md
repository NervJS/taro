---
title: Taro.onLocationChange(callback)
sidebar_label: onLocationChange
---

监听实时地理位置变化事件，需结合 Taro.startLocationUpdateBackground、Taro.startLocationUpdate 使用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.onLocationChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

实时地理位置变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| accuracy | `number` | 位置的精确度 |
| altitude | `number` | 高度，单位 m |
| horizontalAccuracy | `number` | 水平精度，单位 m |
| latitude | `number` | 纬度，范围为 -90~90，负数表示南纬 |
| longitude | `number` | 经度，范围为 -180~180，负数表示西经 |
| speed | `number` | 速度，单位 m/s |
| verticalAccuracy | `number` | 垂直精度，单位 m（Android 无法获取，返回 0） |

## 示例代码

```tsx
const _locationChangeFn = function (res) {
 console.log('location change', res)
}
Taro.onLocationChange(_locationChangeFn)
Taro.offLocationChange(_locationChangeFn)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onLocationChange | ✔️ |  |  |
