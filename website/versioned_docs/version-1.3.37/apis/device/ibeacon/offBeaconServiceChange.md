---
title: Taro.offBeaconServiceChange(callback)
sidebar_label: offBeaconServiceChange
id: version-1.3.37-offBeaconServiceChange
original_id: offBeaconServiceChange
---

取消监听 iBeacon 服务状态变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.offBeaconServiceChange.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | iBeacon 服务状态变化事件的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offBeaconServiceChange | ✔️ |  |  |
