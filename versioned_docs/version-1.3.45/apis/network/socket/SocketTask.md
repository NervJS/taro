---
title: SocketTask
sidebar_label: SocketTask
---


WebSocket 任务，可通过 [wx.connectSocket()](connectSocket.md) 接口创建返回。

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



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| SocketTask | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

