---
title: Taro.offBeaconServiceChange(callback)
sidebar_label: offBeaconServiceChange
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

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.offBeaconServiceChange | ✔️ |  |  |  |  |  |  |  |
