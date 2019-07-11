---
title: Taro.onDeviceMotionChange(callback)
sidebar_label: onDeviceMotionChange
---

监听设备方向变化事件。频率根据 wx.startDeviceMotionListeningListening() 的 interval 参数。可以使用 wx.stopDeviceMotionListeningListening() 停止监听。

## 参数

### callback(res)

设备方向变化事件的回调函数。

#### 参数

##### object res

| Name | Type | Description |
| --- | --- | --- |
| alpha | <code>number</code> | 当手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。 |
| beta | <code>number</code> | 当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。 |
| gamma | <code>number</code> | 当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。 |


## API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onDeviceMotionChange | ✔️ | ✔️ |  ✔️ |
