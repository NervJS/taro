---
title: Taro.onNetworkStatusChange(callback)
sidebar_label: onNetworkStatusChange
---

监听网络状态变化。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.onNetworkStatusChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

网络状态变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| isConnected | `boolean` | 当前是否有网络连接 |
| networkType | "wifi" or "2g" or "3g" or "4g" or "unknown" or "none" | 网络类型 |

## 示例代码

```tsx
Taro.onNetworkStatusChange(function (res) {
  console.log(res.isConnected)
  console.log(res.networkType)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onNetworkStatusChange | ✔️ | ✔️ | ✔️ |
