---
title: Taro.connectSocket(option)
sidebar_label: connectSocket
---

Creates a WebSocket connection. Read [related instructions](https://developers.weixin.qq.com/miniprogram/en/dev/framework/ability/network.html) before use.


**Number of Concurrent Connections**

- In version 1.7.0 or later, up to 5 WebSocket connections can exist at the same time.

- Before version 1.7.0, a mini program can only have one WebSocket connection at a time.If a WebSocket connection already exists, it will be automatically disabled and a new one will be created.


> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/wx.connectSocket.html)

## Type

```tsx
(option: Option) => Promise<SocketTask>
```

## Parameters

### Option

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
      <td>url</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The wss API URL of developer server	</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>HTTP Header. Referer is not available in Header.</td>
    </tr>
    <tr>
      <td>protocols</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sub-protocol array</td>
    </tr>
    <tr>
      <td>tcpNoDelay</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>TCP_NODELAY settings when a TCP connection is established</td>
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

## Sample Code

### Example 1

```tsx
Taro.connectSocket({
  url: 'wss://example.qq.com',
  header:{
    'content-type': 'application/json'
  },
  protocols: ['protocol1']
})
```

### Example 2

```tsx
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

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.connectSocket | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
