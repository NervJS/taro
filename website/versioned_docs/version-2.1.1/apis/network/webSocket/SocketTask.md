---
title: SocketTask
sidebar_label: SocketTask
id: version-2.1.1-SocketTask
original_id: SocketTask
---

WebSocket 任务，可通过 [Taro.connectSocket()](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html) 接口创建返回。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html)

## 方法

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
      <td>socketTaskId</td>
      <td><code>number</code></td>
      <td>websocket 当前的连接 ID。</td>
    </tr>
    <tr>
      <td>readyState</td>
      <td><code>number</code></td>
      <td>websocket 当前的连接状态。</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>websocket 接口调用结果。</td>
    </tr>
    <tr>
      <td>CONNECTING</td>
      <td><code>number</code></td>
      <td>websocket 状态值：连接中。</td>
    </tr>
    <tr>
      <td>OPEN</td>
      <td><code>number</code></td>
      <td>websocket 状态值：已连接。</td>
    </tr>
    <tr>
      <td>CLOSING</td>
      <td><code>number</code></td>
      <td>websocket 状态值：关闭中。</td>
    </tr>
    <tr>
      <td>CLOSED</td>
      <td><code>number</code></td>
      <td>websocket 状态值：已关闭。</td>
    </tr>
    <tr>
      <td>ws</td>
      <td><code>WebSocket</code></td>
      <td>浏览器 websocket 实例。（h5 端独有）</td>
    </tr>
  </tbody>
</table>

### close

关闭 WebSocket 连接

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.close.html)

```tsx
(option: CloseOption) => void
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
      <td><code>CloseOption</code></td>
    </tr>
  </tbody>
</table>

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
      <td>WebSocket 连接关闭事件的回调函数</td>
    </tr>
  </tbody>
</table>

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
      <td>WebSocket 错误事件的回调函数</td>
    </tr>
  </tbody>
</table>

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
      <td><code>T</code></td>
      <td>WebSocket 接受到服务器的消息事件的回调函数</td>
    </tr>
  </tbody>
</table>

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
      <td><code>OnOpenCallback</code></td>
      <td>WebSocket 连接打开事件的回调函数</td>
    </tr>
  </tbody>
</table>

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

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.send | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

## 参数

### CloseOption

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
      <td>code</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>一个数字值表示关闭连接的状态号，表示连接被关闭的原因。</td>
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
      <td>reason</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### OnCloseCallback

WebSocket 连接关闭事件的回调函数

```tsx
(result: OnCloseCallbackResult) => void
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
      <td><code>OnCloseCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnCloseCallbackResult

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
      <td>code</td>
      <td><code>number</code></td>
      <td>一个数字值表示关闭连接的状态号，表示连接被关闭的原因。</td>
    </tr>
    <tr>
      <td>reason</td>
      <td><code>string</code></td>
      <td>一个可读的字符串，表示连接被关闭的原因。</td>
    </tr>
  </tbody>
</table>

### OnErrorCallback

WebSocket 错误事件的回调函数

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

### OnMessageCallback

WebSocket 接受到服务器的消息事件的回调函数

```tsx
(result: OnMessageCallbackResult<T>) => void
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
      <td><code>OnMessageCallbackResult&lt;T&gt;</code></td>
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
      <td>data</td>
      <td><code>T</code></td>
      <td>服务器返回的消息</td>
    </tr>
  </tbody>
</table>

### OnOpenCallback

WebSocket 连接打开事件的回调函数

```tsx
(result: OnOpenCallbackResult) => void
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
      <td><code>OnOpenCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnOpenCallbackResult

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
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>连接成功的 HTTP 响应 Header</td>
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

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| SocketTask.close | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onClose | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onMessage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.onOpen | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask.send | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
