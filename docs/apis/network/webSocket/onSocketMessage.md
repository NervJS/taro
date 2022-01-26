---
title: Taro.onSocketMessage(callback)
sidebar_label: onSocketMessage
---

监听 WebSocket 接受到服务器的消息事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketMessage.html)

## 类型

```tsx
<T = any>(callback: Callback<T>) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `T` | WebSocket 接受到服务器的消息事件的回调函数 |

### Callback

WebSocket 接受到服务器的消息事件的回调函数

```tsx
(result: CallbackResult<T>) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult<T>` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `T` | 服务器返回的消息 |

## 示例代码

```tsx
Taro.connectSocket({
  url: 'test.php'
})
Taro.onSocketMessage(function (res) {
  console.log('收到服务器内容：' + res.data)
})
```
