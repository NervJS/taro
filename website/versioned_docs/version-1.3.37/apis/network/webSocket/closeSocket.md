---
title: Taro.closeSocket(option)
sidebar_label: closeSocket
id: version-1.3.37-closeSocket
original_id: closeSocket
---

关闭 WebSocket 连接

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.closeSocket.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| code | `number` | 否 | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| reason | `string` | 否 | 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.connectSocket({
  url: 'test.php'
})
//注意这里有时序问题，
//如果 Taro.connectSocket 还没回调 Taro.onSocketOpen，而先调用 Taro.closeSocket，那么就做不到关闭 WebSocket 的目的。
//必须在 WebSocket 打开期间调用 Taro.closeSocket 才能关闭。
Taro.onSocketOpen(function() {
  Taro.closeSocket()
})
Taro.onSocketClose(function(res) {
  console.log('WebSocket 已关闭！')
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.closeSocket | ✔️ | ✔️ | ✔️ |  |  |
