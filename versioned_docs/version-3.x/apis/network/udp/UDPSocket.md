---
title: UDPSocket
sidebar_label: UDPSocket
---

一个 UDP Socket 实例，默认使用 IPv4 协议。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.html)

## 方法

### close

关闭 UDP Socket 实例，相当于销毁。 在关闭之后，UDP Socket 实例不能再发送消息，每次调用 `UDPSocket.send` 将会触发错误事件，并且 message 事件回调函数也不会再也执行。在 `UDPSocket` 实例被创建后将被 Native 强引用，保证其不被 GC。在 `UDPSocket.close` 后将解除对其的强引用，让 UDPSocket 实例遵从 GC。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.close.html)

```tsx
() => void
```

### offClose

取消监听关闭事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offClose.html)

```tsx
(callback: OffCloseCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OffCloseCallback` | 关闭事件的回调函数 |

### offError

取消监听错误事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offError.html)

```tsx
(callback: OffErrorCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OffErrorCallback` | 错误事件的回调函数 |

### offListening

取消监听开始监听数据包消息的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offListening.html)

```tsx
(callback: (res: TaroGeneral.CallbackResult) => void) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: TaroGeneral.CallbackResult) => void` | 开始监听数据包消息的事件的回调函数 |

### offMessage

取消监听收到消息的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offMessage.html)

```tsx
(callback: (res: TaroGeneral.CallbackResult) => void) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: TaroGeneral.CallbackResult) => void` | 收到消息的事件的回调函数 |

### onClose

监听关闭事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onClose.html)

```tsx
(callback: OnCloseCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnCloseCallback` | 关闭事件的回调函数 |

### onError

监听错误事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnErrorCallback` | 错误事件的回调函数 |

### onListening

监听开始监听数据包消息的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onListening.html)

```tsx
(callback: (res: TaroGeneral.CallbackResult) => void) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: TaroGeneral.CallbackResult) => void` | 开始监听数据包消息的事件的回调函数 |

### onMessage

监听收到消息的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onMessage.html)

```tsx
(callback: OnMessageCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnMessageCallback` | 收到消息的事件的回调函数 |

### send

向指定的 IP 和 port 发送消息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.send.html)

```tsx
(option: SendOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SendOption` |

### bind

绑定一个系统随机分配的可用端口，或绑定一个指定的端口号

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.bind.html)

```tsx
(port: number) => number
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| port | `number` | 指定要绑定的端口号 |

## 参数

### OffCloseCallback

关闭事件的回调函数

```tsx
(res: TaroGeneral.CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `TaroGeneral.CallbackResult` |

### OffErrorCallback

错误事件的回调函数

```tsx
(res: TaroGeneral.CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `TaroGeneral.CallbackResult` |

### OnCloseCallback

关闭事件的回调函数

```tsx
(res: TaroGeneral.CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `TaroGeneral.CallbackResult` |

### OnErrorCallback

错误事件的回调函数

```tsx
(result: OnErrorCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnErrorCallbackResult` |

### OnMessageCallback

收到消息的事件的回调函数

```tsx
(result: OnMessageCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnMessageCallbackResult` |

### OnErrorCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |

### OnMessageCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| message | `ArrayBuffer` | 收到的消息 |
| remoteInfo | `RemoteInfo` | 消息来源的结构化信息 |

### RemoteInfo

消息来源的结构化信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| address | `string` | 发送消息的 socket 的地址 |
| family | `string` | 使用的协议族，为 IPv4 或者 IPv6 |
| port | `number` | 端口号 |
| size | `number` | message 的大小，单位：字节 |

### SendOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | string or ArrayBuffer | 是 | 需要发送的内容 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.close | ✔️ |  |  |
| UDPSocket.offClose | ✔️ |  |  |
| UDPSocket.offError | ✔️ |  |  |
| UDPSocket.offListening | ✔️ |  |  |
| UDPSocket.offMessage | ✔️ |  |  |
| UDPSocket.onClose | ✔️ |  |  |
| UDPSocket.onError | ✔️ |  |  |
| UDPSocket.onListening | ✔️ |  |  |
| UDPSocket.onMessage | ✔️ |  |  |
| UDPSocket.send | ✔️ |  |  |
| UDPSocket.bind | ✔️ |  |  |
