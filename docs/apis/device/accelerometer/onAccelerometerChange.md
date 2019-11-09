---
title: Taro.onAccelerometerChange(callback)
sidebar_label: onAccelerometerChange
---

监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 `Taro.stopAccelerometer` 停止监听。

## 类型

```tsx
(callback: Param) => void
```

## 参数

### Param callback

```tsx
(res: ParamParam) => any
```

### ParamParam

| Name | Type | Description |
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

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.onAccelerometerChange | ✔️ |  |  |  |  | ✔️ | ✔️ |  |

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.onAccelerometerChange.html)
