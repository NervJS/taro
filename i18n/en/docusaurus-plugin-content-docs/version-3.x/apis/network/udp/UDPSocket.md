---
title: UDPSocket
sidebar_label: UDPSocket
---

An UDP Socket instance. Use IPv4 protocol by default.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.html)

## Methods

### close

Closes (Terminates) a UDP Socket instance. After closing, the UDP Socket instance can no longer send messages. Calling `UDPSocket.send` will trigger an error event, and the callback function for the message event will not be executed. After the `UDPSocket` instance is created, it will be strongly referenced by Native to ensure that it is not collected by GC. After calling `UDPSocket.close`, the strong reference to it will be removed, and the UDPSocket instance will follow the GC rules.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.close.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.close | ✔️ |  |  |

### offClose

Un-listens on the disabling event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.offClose.html)

```tsx
(callback: OffCloseCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffCloseCallback</code></td>
      <td>The callback function for the disabling event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.offClose | ✔️ |  |  |

### offError

Un-listens on the error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.offError.html)

```tsx
(callback: OffErrorCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffErrorCallback</code></td>
      <td>The callback function for the error event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.offError | ✔️ |  |  |

### offListening

Un-listens on the event of starting listening on data packet messages.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.offListening.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the event of starting listening on data packet messages.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.offListening | ✔️ |  |  |

### offMessage

Un-listens on the event of receiving messages.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.offMessage.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the event of receiving messages.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.offMessage | ✔️ |  |  |

### onClose

Listens on the disabling event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.onClose.html)

```tsx
(callback: OnCloseCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnCloseCallback</code></td>
      <td>The callback function for the disabling event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.onClose | ✔️ |  |  |

### onError

Listens on the error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnErrorCallback</code></td>
      <td>The callback function for the error event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.onError | ✔️ |  |  |

### onListening

Listens on the event of starting listening on data packet messages.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.onListening.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the event of starting listening on data packet messages.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.onListening | ✔️ |  |  |

### onMessage

Listens on the event of receiving messages.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.onMessage.html)

```tsx
(callback: OnMessageCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnMessageCallback</code></td>
      <td>The callback function for the event of receiving messages.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.onMessage | ✔️ |  |  |

### send

Sends messages to the specified IP and port.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.send.html)

```tsx
(option: SendOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>SendOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.send | ✔️ |  |  |

### bind

Binds an available port randomly assigned by the system.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/udp/UDPSocket.bind.html)

```tsx
(port: number) => number
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>port</td>
      <td><code>number</code></td>
      <td>Bound port number</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UDPSocket.bind | ✔️ |  |  |

## Parameters

### OffCloseCallback

The callback function for the disabling event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the error event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the disabling event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the error event.

```tsx
(result: OnErrorCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the event of receiving messages.

```tsx
(result: OnMessageCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
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
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>message</td>
      <td><code>ArrayBuffer</code></td>
      <td>Received messages</td>
    </tr>
    <tr>
      <td>remoteInfo</td>
      <td><code>RemoteInfo</code></td>
      <td>Structured information of message sources</td>
    </tr>
  </tbody>
</table>

### RemoteInfo

remoteInfo is composed as follows

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>address</td>
      <td><code>string</code></td>
      <td>The address of the socket sending the message</td>
    </tr>
    <tr>
      <td>family</td>
      <td><code>string</code></td>
      <td>The protocol family used, IPv4 or IPv6</td>
    </tr>
    <tr>
      <td>port</td>
      <td><code>number</code></td>
      <td>Port number</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>The message size, in bytes</td>
    </tr>
  </tbody>
</table>

### SendOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The data to be sent</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
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
