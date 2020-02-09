---
title: Taro.onDeviceMotionChange(callback)
sidebar_label: onDeviceMotionChange
id: version-1.3.37-onDeviceMotionChange
original_id: onDeviceMotionChange
---

监听设备方向变化事件。频率根据 Taro.startDeviceMotionListening() 的 interval 参数。可以使用 Taro.stopDeviceMotionListening() 停止监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.onDeviceMotionChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

设备方向变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| alpha | `number` | 当 手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。 |
| beta | `number` | 当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。 |
| gamma | `number` | 当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onDeviceMotionChange | ✔️ | ✔️ | ✔️ |
