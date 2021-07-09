---
title: Taro.sendSocketMessage(option)
sidebar_label: sendSocketMessage
---

Sends data over WebSocket connection. Call `Taro.connectSocket` first and send data after the `Taro.onSocketOpen` callback.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/wx.sendSocketMessage.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
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

## Sample Code

```tsx
let socketOpen = false
const socketMsgQueue = []
Taro.connectSocket({
  url: 'test.php'
})
Taro.onSocketOpen(function(res) {
  socketOpen = true
  for (let i = 0; i < socketMsgQueue.length; i++){
    sendSocketMessage(socketMsgQueue[i])
  }
  socketMsgQueue = []
})
function sendSocketMessage(msg) {
  if (socketOpen) {
    Taro.sendSocketMessage({
      data:msg
    })
  } else {
    socketMsgQueue.push(msg)
  }
}
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.sendSocketMessage | ✔️ | ✔️ | ✔️ |  |  |
