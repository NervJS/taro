---
title: Taro.onNetworkWeakChange(callback)
sidebar_label: onNetworkWeakChange
---

监听弱网状态变化事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.onNetworkWeakChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 弱网状态变化事件的回调函数 |

### Callback

弱网状态变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| weakNet | `boolean` | 当前是否处于弱网状态 |
| networkType | `keyof NetworkType` | 当前网络类型 |

## 示例代码

```tsx
Taro.onNetworkWeakChange(function (res) {
  console.log(res.weakNet)
  console.log(res.networkType)
})
// 取消监听
Taro.offNetworkWeakChange()
```
