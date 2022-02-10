---
title: Taro.onSocketClose(callback)
sidebar_label: onSocketClose
---

监听 WebSocket 连接关闭事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketClose.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | WebSocket 连接关闭事件的回调函数 |

### Callback

WebSocket 连接关闭事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| code | `number` | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 |
| reason | `string` | 一个可读的字符串，表示连接被关闭的原因。 |

## 示例代码

```tsx
Taro.connectSocket({
  url: 'test.php'
})
//注意这里有时序问题，
//如果 Taro.connectSocket 还没回调 Taro.onSocketOpen，而先调用 Taro.closeSocket，那么就做不到关闭 WebSocket 的目的。
//必须在 WebSocket 打开期间调用 Taro.closeSocket 才能关闭。
Taro.onSocketOpen(function () {
  Taro.closeSocket()
})
Taro.onSocketClose(function (res) {
  console.log('WebSocket 已关闭！')
})
```
