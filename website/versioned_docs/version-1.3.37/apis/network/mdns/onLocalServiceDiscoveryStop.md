---
title: Taro.onLocalServiceDiscoveryStop(callback)
sidebar_label: onLocalServiceDiscoveryStop
id: version-1.3.37-onLocalServiceDiscoveryStop
original_id: onLocalServiceDiscoveryStop
---

监听 mDNS 服务停止搜索的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceDiscoveryStop.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

mDNS 服务停止搜索的事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onLocalServiceDiscoveryStop | ✔️ |  |  |
