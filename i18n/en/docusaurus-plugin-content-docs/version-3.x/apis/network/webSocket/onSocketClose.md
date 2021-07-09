---
title: Taro.onSocketClose(callback)
sidebar_label: onSocketClose
---

Listens on the event of disabling the WebSocket connection.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/wx.onSocketClose.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the event of disabling the WebSocket connection.

```tsx
(result: CallbackResult) => void
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
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

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

## Sample Code

```tsx
Taro.connectSocket({
  url: 'test.php'
})

//Pay attention to the operation sequence
//If you call  wx.closeSocket before the  wx.onSocketOpen callback for  wx.connectSocket ,  WebSocket  connection cannot be disabled.
//You can only call wx.closeSocket to disable the connection when WebSocket is enabled.
Taro.onSocketOpen(function () {
  Taro.closeSocket()
})
Taro.onSocketClose(function (res) {
  console.log('WebSocket Disabled!')
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.onSocketClose | ✔️ | ✔️ | ✔️ |  |  |
