---
title: Taro.onLocalServiceLost(callback)
sidebar_label: onLocalServiceLost
---

监听 mDNS 服务离开的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceLost.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

mDNS 服务离开的事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| serviceName | `string` | 服务的名称 |
| serviceType | `string` | 服务的类型 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onLocalServiceLost | ✔️ |  |  |
