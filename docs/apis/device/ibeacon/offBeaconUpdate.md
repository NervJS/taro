---
title: Taro.offBeaconUpdate(callback)
sidebar_label: offBeaconUpdate
---

取消监听 iBeacon 设备更新事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.offBeaconUpdate.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | iBeacon 设备更新事件的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offBeaconUpdate | ✔️ |  |  |
