---
title: Taro.onBeaconServiceChange(callback)
sidebar_label: onBeaconServiceChange
---

监听 iBeacon 服务状态变化事件，仅能注册一个监听

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconServiceChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

iBeacon 服务状态变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| available | `boolean` | 服务目前是否可用 |
| discovering | `boolean` | 目前是否处于搜索状态 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBeaconServiceChange | ✔️ |  |  |
