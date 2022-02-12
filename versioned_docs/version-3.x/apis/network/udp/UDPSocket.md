---
title: UDPSocket
sidebar_label: UDPSocket
---

一个 UDP Socket 实例，默认使用 IPv4 协议。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.html)

## 方法

### bind

绑定一个系统随机分配的可用端口，或绑定一个指定的端口号

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.bind.html)

```tsx
(port: number) => number
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| port | `number` | 指定要绑定的端口号，不传则返回系统随机分配的可用端口 |

#### 示例代码

```tsx
const udp = Taro.createUDPSocket()
udp.close()
```

### close

关闭 UDP Socket 实例，相当于销毁。 在关闭之后，UDP Socket 实例不能再发送消息，每次调用 `UDPSocket.send` 将会触发错误事件，并且 message 事件回调函数也不会再也执行。在 `UDPSocket` 实例被创建后将被 Native 强引用，保证其不被 GC。在 `UDPSocket.close` 后将解除对其的强引用，让 UDPSocket 实例遵从 GC。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.close.html)

```tsx
() => void
```

### connect

预先连接到指定的 IP 和 port，需要配合 write 方法一起使用

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.connect.html)

```tsx
(option: Option) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### offClose

取消监听关闭事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offClose.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 关闭事件的回调函数 |

### offError

取消监听错误事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offError.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 错误事件的回调函数 |

### offListening

取消监听开始监听数据包消息的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offListening.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 监听开始监听数据包消息的事件 |

### offMessage

取消监听收到消息的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offMessage.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 收到消息的事件的回调函数 |

### onClose

监听关闭事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onClose.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 关闭事件的回调函数 |

### onError

监听错误事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onError.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 错误事件的回调函数 |

### onListening

监听开始监听数据包消息的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onListening.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 监听开始监听数据包消息的事件 |

### onMessage

监听收到消息的事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onMessage.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 收到消息的事件的回调函数 |

### send

向指定的 IP 和 port 发送消息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.send.html)

```tsx
(option: Option) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

#### 示例代码

```tsx
const udp = Taro.createUDPSocket()
udp.bind()
udp.send({
  address: '192.168.193.2',
  port: 8848,
  message: 'hello, how are you'
})
```

### setTTL

设置 IP_TTL 套接字选项，用于设置一个 IP 数据包传输时允许的最大跳步数

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.setTTL.html)

```tsx
(ttl: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| ttl | `number` | ttl 参数可以是 0 到 255 之间 |

#### 示例代码

```tsx
const udp = Taro.createUDPSocket()
udp.onListening(function () {
  udp.setTTL(64)
})
udp.bind()
```

### write

用法与 send 方法相同，如果没有预先调用 connect 则与 send 无差异（注意即使调用了 connect 也需要在本接口填入地址和端口参数）

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.write.html)

```tsx
() => void
```

## 参数

### connect

#### Option

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| address | `string` | 要发消息的地址 |
| port | `number` | 要发送消息的端口号 |

### onClose

#### Callback

当一个 socket 完全关闭就发出该事件的回调函数

```tsx
(args: unknown[]) => void
```

| 参数 | 类型 |
| --- | --- |
| args | `unknown[]` |

### onError

#### Callback

错误事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

#### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |

### onListening

#### Callback

监听开始监听数据包消息的事件

```tsx
(args: unknown[]) => void
```

| 参数 | 类型 |
| --- | --- |
| args | `unknown[]` |

### onMessage

#### Callback

收到消息的事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

#### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| message | `ArrayBuffer` | 收到的消息 |
| remoteInfo | `RemoteInfo` | 发送端地址信息 |
| localInfo | `LocalInfo` | 接收端地址信息 |

#### RemoteInfo

发送端地址信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| address | `string` | 发送消息的 socket 的地址 |
| family | `string` | 使用的协议族，为 IPv4 或者 IPv6 |
| port | `number` | 端口号 |

#### LocalInfo

接收端地址信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| address | `string` | 接收消息的 socket 的地址 |
| family | `string` | 使用的协议族，为 IPv4 或者 IPv6 |
| port | `number` | 端口号 |
| size | `number` | message 的大小，单位：字节 |

### send

#### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| address | `string` |  | 是 | 要发消息的地址。在基础库 <= 2.9.3 版本必须是和本机同网段的 IP 地址，或安全域名列表内的域名地址；之后版本可以是任意 IP 和域名 |
| port | `number` |  | 是 | 要发送消息的端口号 |
| message | string or ArrayBuffer |  | 是 | 要发送的数据 |
| offset | `number` | `0` | 否 | 发送数据的偏移量，仅当 message 为 ArrayBuffer 类型时有效 |
| length | `number` | `message.byteLength` | 否 | 发送数据的长度，仅当 message 为 ArrayBuffer 类型时有效 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.bind | ✔️ |  |  |
| UDPSocket.close | ✔️ |  |  |
| UDPSocket.connect | ✔️ |  |  |
| UDPSocket.offClose | ✔️ |  |  |
| UDPSocket.offError | ✔️ |  |  |
| UDPSocket.offListening | ✔️ |  |  |
| UDPSocket.offMessage | ✔️ |  |  |
| UDPSocket.onClose | ✔️ |  |  |
| UDPSocket.onError | ✔️ |  |  |
| UDPSocket.onListening | ✔️ |  |  |
| UDPSocket.onMessage | ✔️ |  |  |
| UDPSocket.send | ✔️ |  |  |
| UDPSocket.setTTL | ✔️ |  |  |
| UDPSocket.write | ✔️ |  |  |
