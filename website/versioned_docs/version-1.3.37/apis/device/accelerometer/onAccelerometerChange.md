---
title: Taro.onAccelerometerChange(callback)
sidebar_label: onAccelerometerChange
id: version-1.3.37-onAccelerometerChange
original_id: onAccelerometerChange
---

监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 `Taro.stopAccelerometer` 停止监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.onAccelerometerChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

```tsx
(res: Result) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `Result` |

### Result

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | X 轴 |
| y | `number` | Y 轴 |
| z | `number` | Z 轴 |

## 示例代码

```tsx
Taro.onAccelerometerChange(res => {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onAccelerometerChange | ✔️ | ✔️ | ✔️ |
