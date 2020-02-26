---
title: Taro.onWifiConnected(callback)
sidebar_label: onWifiConnected
---

监听连接上 Wi-Fi 的事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onWifiConnected.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

连接上 Wi-Fi 的事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| wifi | `WifiInfo` | Wi-Fi 信息 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onWifiConnected | ✔️ |  |  |
