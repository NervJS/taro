---
title: Taro.offNetworkStatusChange(callback)
sidebar_label: offNetworkStatusChange
id: version-1.3.37-offNetworkStatusChange
original_id: offNetworkStatusChange
---

取消监听网络状态变化事件，参数为空，则取消所有的事件监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.offNetworkStatusChange.html)

## 类型

```tsx
(callback: (...args: any[]) => any) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(...args: any[]) => any` | 网络状态变化事件的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offNetworkStatusChange | ✔️ |  |  |
