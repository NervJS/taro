---
title: SocketTask
sidebar_label: SocketTask
---

WebSocket 任务，可通过 [Taro.connectSocket()](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html) 接口创建返回。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| socketTaskId | `number` | websocket 当前的连接 ID。 |
| readyState | `number` | websocket 当前的连接状态。 |
| errMsg | `string` | websocket 接口调用结果。 |
| CONNECTING | `number` | websocket 状态值：连接中。 |
| OPEN | `number` | websocket 状态值：已连接。 |
| CLOSING | `number` | websocket 状态值：关闭中。 |
| CLOSED | `number` | websocket 状态值：已关闭。 |
| ws | `WebSocket` | 浏览器 websocket 实例。（h5 端独有） |

### close

关闭 WebSocket 连接

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.close.html)

```tsx
(option: CloseOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `CloseOption` |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.close | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onClose

监听 WebSocket 连接关闭事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.onClose.html)

```tsx
(callback: OnCloseCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnCloseCallback` | WebSocket 连接关闭事件的回调函数 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.onClose | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onError

监听 WebSocket 错误事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnErrorCallback` | WebSocket 错误事件的回调函数 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onMessage

监听 WebSocket 接受到服务器的消息事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.onMessage.html)

```tsx
<T = any>(callback: OnMessageCallback<T>) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `T` | WebSocket 接受到服务器的消息事件的回调函数 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.onMessage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onOpen

监听 WebSocket 连接打开事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.onOpen.html)

```tsx
(callback: OnOpenCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnOpenCallback` | WebSocket 连接打开事件的回调函数 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.onOpen | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### send

通过 WebSocket 连接发送数据

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.send.html)

```tsx
(option: SendOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SendOption` |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.send | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

## 参数

### CloseOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| code | `number` | 否 | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| reason | `string` | 否 | 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### OnCloseCallback

WebSocket 连接关闭事件的回调函数

```tsx
(result: OnCloseCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnCloseCallbackResult` |

### OnCloseCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| code | `number` | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。 |
| reason | `string` | 一个可读的字符串，表示连接被关闭的原因。 |

### OnErrorCallback

WebSocket 错误事件的回调函数

```tsx
(result: OnErrorCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnErrorCallbackResult` |

### OnErrorCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |

### OnMessageCallback

WebSocket 接受到服务器的消息事件的回调函数

```tsx
(result: OnMessageCallbackResult<T>) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnMessageCallbackResult<T>` |

### OnMessageCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `T` | 服务器返回的消息 |

### OnOpenCallback

WebSocket 连接打开事件的回调函数

```tsx
(result: OnOpenCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnOpenCallbackResult` |

### OnOpenCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| header | `Record<string, any>` | 连接成功的 HTTP 响应 Header |

### SendOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | string or ArrayBuffer | 是 | 需要发送的内容 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.close | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onClose | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onMessage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onOpen | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.send | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
