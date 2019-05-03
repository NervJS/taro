---
title: WebSocket
sidebar_label: WebSocket
---

## Taro.connectSocket(OBJECT)

创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 链接。

支持存在最多**两个** WebSocket 链接，每次成功调用 Taro.connectSocket 会返回一个新的 [SocketTask](native-api.md#sockettask)。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| url | String | 是 | 开发者服务器接口地址，必须是 wss 协议 |
| header | Object | 否 | HTTP Header , header 中不能设置 Referer |
| method | String | 否 | 默认是 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT |
| protocols | StringArray | 否 | 子协议数组 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.connectSocket({
  url: 'ws://echo.websocket.org/echo',
  success: function () {
    console.log('connect success')
  }
}).then(task => {
  task.onOpen(function () {
    console.log('onOpen')
    task.send({ data: 'xxx' })
  })
  task.onMessage(function (msg) {
    console.log('onMessage: ', msg)
    task.close()
  })
  task.onError(function () {
    console.log('onError')
  })
  task.onClose(function (e) {
    console.log('onClose: ', e)
  })
})
```

## SocketTask

WebSocket 任务，可通过 [wx.connectSocket()](native-api.md#taroconnectsocketobject) 接口创建返回。

属性

socketTask.readyState: WebSocket 当前的连接状态。

socketTask.CONNECTING: WebSocket 状态值：连接中。

socketTask.OPEN: WebSocket 状态值：已连接。

socketTask.CLOSING: WebSocket 状态值：关闭中。

socketTask.CLOSED: WebSocket 状态值：已关闭。

socketTask.ws: 浏览器 WebSocket 实例。（**H5 端独有**）

方法

SocketTask.send(OBJECT)

通过 WebSocket 连接发送数据。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| data | String/ArrayBuffer | 是 | 需要发送的内容 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

SocketTask.close(OBJECT)

关闭 WebSocket 连接。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| code | Number | 否 | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是 1000 （表示正常连接关闭） |
| reason | String | 否 | 一个可读的字符串，表示连接被关闭的原因 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

SocketTask.onOpen(CALLBACK)

监听 WebSocket 连接打开事件。

SocketTask.onClose(CALLBACK)

监听 WebSocket 连接关闭事件。

**CALLBACK 返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| code | Number | 关闭连接的状态号 |
| reason | String | 连接被关闭的原因 |

SocketTask.onError(CALLBACK)

监听 WebSocket 错误。

**CALLBACK 返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| errMsg | String | 错误信息 |

SocketTask.onMessage(CALLBACK)

监听 WebSocket 接受到服务器的消息事件。

**CALLBACK 返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| data | String/ArrayBuffer | 服务器返回的消息 |

## Taro.onSocketOpen

`@Deprecated` 请使用 **SocketTask.onOpen**

## Taro.onSocketError

`@Deprecated` 请使用 **SocketTask.onError**

## Taro.sendSocketMessage

`@Deprecated` 请使用 **SocketTask.send**

## Taro.onSocketMessage

`@Deprecated` 请使用 **SocketTask.onMessage**

## Taro.closeSocket

`@Deprecated` 请使用 **SocketTask.close**

## Taro.onSocketClose

`@Deprecated` 请使用 **SocketTask.onClose**

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.connectSocket | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Taro.onSocketOpen | ✔️ |  |  | ✔️ | ✔️ |
| Taro.onSocketError | ✔️ |  |  | ✔️ | ✔️ |
| Taro.sendSocketMessage | ✔️ |  |  | ✔️ | ✔️ |
| Taro.onSocketMessage | ✔️ |  |  | ✔️ | ✔️ |
| Taro.closeSocket | ✔️ |  |  | ✔️ | ✔️ |
| Taro.onSocketClose | ✔️ |  |  | ✔️ | ✔️ |
