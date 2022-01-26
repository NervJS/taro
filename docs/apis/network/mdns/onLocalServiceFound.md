---
title: Taro.onLocalServiceFound(callback)
sidebar_label: onLocalServiceFound
---

监听 mDNS 服务发现的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceFound.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | mDNS 服务发现的事件的回调函数 |

### Callback

mDNS 服务发现的事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| ip | `string` | 服务的 ip 地址 |
| port | `number` | 服务的端口 |
| serviceName | `string` | 服务的名称 |
| serviceType | `string` | 服务的类型 |
