---
title: SocketTask
sidebar_label: SocketTask
---

The WebSocket task can be created and returned via the `Taro.connectSocket()` API.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/SocketTask.html)

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
      <td>socketTaskId</td>
      <td><code>number</code></td>
      <td>The current connection ID of the websocket.</td>
    </tr>
    <tr>
      <td>readyState</td>
      <td><code>number</code></td>
      <td>The current connection status of the websocket.</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>The result of the call to the websocket interface.</td>
    </tr>
    <tr>
      <td>CONNECTING</td>
      <td><code>number</code></td>
      <td>websocket status value: Connecting.</td>
    </tr>
    <tr>
      <td>OPEN</td>
      <td><code>number</code></td>
      <td>websocket status value: Connected.</td>
    </tr>
    <tr>
      <td>CLOSING</td>
      <td><code>number</code></td>
      <td>websocket status value: Closing.</td>
    </tr>
    <tr>
      <td>CLOSED</td>
      <td><code>number</code></td>
      <td>websocket status value: Closed.</td>
    </tr>
    <tr>
      <td>ws</td>
      <td><code>WebSocket</code></td>
      <td>Browser websocket instances. (Only H5)</td>
    </tr>
  </tbody>
</table>

## Methods

### close

Disables the WebSocket connection

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/SocketTask.close.html)

```tsx
(option: CloseOption) => void
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
      <td><code>CloseOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.close | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onClose

Listens on the event of disabling the WebSocket connection.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/SocketTask.onClose.html)

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
      <td>The callback function for the event of disabling the WebSocket connection.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.onClose | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onError

Listens on the WebSocket error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/SocketTask.onError.html)

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
      <td>The callback function for the WebSocket error event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onMessage

Listens on the event of receiving server messages by WebSocket

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/SocketTask.onMessage.html)

```tsx
<T = any>(callback: OnMessageCallback<T>) => void
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
      <td><code>T</code></td>
      <td>The callback function for the event of receiving server messages by WebSocket.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.onMessage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onOpen

Listens on the event of enabling the WebSocket connection.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/SocketTask.onOpen.html)

```tsx
(callback: OnOpenCallback) => void
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
      <td><code>OnOpenCallback</code></td>
      <td>The callback function for the event of enabling the WebSocket connection.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.onOpen | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### send

Sends data over a WebSocket connection

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/SocketTask.send.html)

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

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.send | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

## Parameters

### CloseOption

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
      <td>code</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A numeric value indicates the status code explaining why the connection has been disabled.</td>
    </tr>
    <tr>
      <td>reason</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A readable string explaining why the connection has been disabled.</td>
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

### OnCloseCallback

The callback function for the event of disabling the WebSocket connection.

```tsx
(result: OnCloseCallbackResult) => void
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
      <td><code>OnCloseCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnCloseCallbackResult

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
      <td>code</td>
      <td><code>number</code></td>
      <td>A numeric value indicates the status code explaining why the connection has been disabled.</td>
    </tr>
    <tr>
      <td>reason</td>
      <td><code>string</code></td>
      <td>A readable string explaining why the connection has been disabled.</td>
    </tr>
  </tbody>
</table>

### OnErrorCallback

The callback function for the WebSocket error event.

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
      <td>Error message</td>
    </tr>
  </tbody>
</table>

### OnMessageCallback

The callback function for the event of receiving server messages by WebSocket.

```tsx
(result: OnMessageCallbackResult<T>) => void
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
      <td><code>OnMessageCallbackResult&lt;T&gt;</code></td>
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
      <td>data</td>
      <td><code>T</code></td>
      <td>Messages returned by the server</td>
    </tr>
  </tbody>
</table>

### OnOpenCallback

The callback function for the event of enabling the WebSocket connection.

```tsx
(result: OnOpenCallbackResult) => void
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
      <td><code>OnOpenCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnOpenCallbackResult

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
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>Connected HTTP response header</td>
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

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.close | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onClose | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onMessage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onOpen | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.send | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
