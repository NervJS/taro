---
title: UDPSocket
sidebar_label: UDPSocket
---

一个 UDP Socket 实例，默认使用 IPv4 协议。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.html)

## 方法

### close

关闭 UDP Socket 实例，相当于销毁。 在关闭之后，UDP Socket 实例不能再发送消息，每次调用 `UDPSocket.send` 将会触发错误事件，并且 message 事件回调函数也不会再也执行。在 `UDPSocket` 实例被创建后将被 Native 强引用，保证其不被 GC。在 `UDPSocket.close` 后将解除对其的强引用，让 UDPSocket 实例遵从 GC。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.close.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.close | ✔️ |  |  |

### offClose

取消监听关闭事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offClose.html)

```tsx
(callback: OffCloseCallback) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffCloseCallback</code></td>
      <td>关闭事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.offClose | ✔️ |  |  |

### offError

取消监听错误事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offError.html)

```tsx
(callback: OffErrorCallback) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffErrorCallback</code></td>
      <td>错误事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.offError | ✔️ |  |  |

### offListening

取消监听开始监听数据包消息的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offListening.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>开始监听数据包消息的事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.offListening | ✔️ |  |  |

### offMessage

取消监听收到消息的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.offMessage.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>收到消息的事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.offMessage | ✔️ |  |  |

### onClose

监听关闭事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onClose.html)

```tsx
(callback: OnCloseCallback) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnCloseCallback</code></td>
      <td>关闭事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.onClose | ✔️ |  |  |

### onError

监听错误事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnErrorCallback</code></td>
      <td>错误事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.onError | ✔️ |  |  |

### onListening

监听开始监听数据包消息的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onListening.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>开始监听数据包消息的事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.onListening | ✔️ |  |  |

### onMessage

监听收到消息的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.onMessage.html)

```tsx
(callback: OnMessageCallback) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnMessageCallback</code></td>
      <td>收到消息的事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.onMessage | ✔️ |  |  |

### send

向指定的 IP 和 port 发送消息

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.send.html)

```tsx
(option: SendOption) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>SendOption</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.send | ✔️ |  |  |

### bind

绑定一个系统随机分配的可用端口，或绑定一个指定的端口号

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/UDPSocket.bind.html)

```tsx
(port: number) => number
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>port</td>
      <td><code>number</code></td>
      <td>指定要绑定的端口号</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.bind | ✔️ |  |  |

## 参数

### OffCloseCallback

关闭事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OffErrorCallback

错误事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnCloseCallback

关闭事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnErrorCallback

错误事件的回调函数

```tsx
(result: OnErrorCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnErrorCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnMessageCallback

收到消息的事件的回调函数

```tsx
(result: OnMessageCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnMessageCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnErrorCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
  </tbody>
</table>

### OnMessageCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>message</td>
      <td><code>ArrayBuffer</code></td>
      <td>收到的消息</td>
    </tr>
    <tr>
      <td>remoteInfo</td>
      <td><code>RemoteInfo</code></td>
      <td>消息来源的结构化信息</td>
    </tr>
  </tbody>
</table>

### RemoteInfo

消息来源的结构化信息

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>address</td>
      <td><code>string</code></td>
      <td>发送消息的 socket 的地址</td>
    </tr>
    <tr>
      <td>family</td>
      <td><code>string</code></td>
      <td>使用的协议族，为 IPv4 或者 IPv6</td>
    </tr>
    <tr>
      <td>port</td>
      <td><code>number</code></td>
      <td>端口号</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>message 的大小，单位：字节</td>
    </tr>
  </tbody>
</table>

### SendOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td style="text-align:center">是</td>
      <td>需要发送的内容</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

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
