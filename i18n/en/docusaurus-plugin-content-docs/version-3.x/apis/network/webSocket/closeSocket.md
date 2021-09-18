---
title: Taro.closeSocket(option)
sidebar_label: closeSocket
---

Disables the WebSocket connection

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/wx.closeSocket.html)

## Type

```tsx
(option?: Option) => Promise<CallbackResult>
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
      <td>code</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A numeric value indicates the status code explaining why the connection has been disabled.</td>
    </tr>
    <tr>
      <td>reason</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A readable string explaining why the connection has been disabled. This string must be a UTF-8-encoded text (not characters) with not more than 123 bytes.</td>
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
Taro.connectSocket({
  url: 'test.php'
})

//Pay attention to the operation sequence
//If you call  wx.closeSocket before the  wx.onSocketOpen callback for  wx.connectSocket ,  WebSocket  connection cannot be disabled.
//You can only call wx.closeSocket to disable the connection when WebSocket is enabled.
Taro.onSocketOpen(function() {
  Taro.closeSocket()
})
Taro.onSocketClose(function(res) {
  console.log('WebSocket Disabled!')
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.closeSocket | ✔️ | ✔️ | ✔️ |  |  |
