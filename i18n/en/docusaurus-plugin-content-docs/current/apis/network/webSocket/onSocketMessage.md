---
title: Taro.onSocketMessage(callback)
sidebar_label: onSocketMessage
---

Listens on the event of receiving server messages by WebSocket

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/wx.onSocketMessage.html)

## Type

```tsx
<T = any>(callback: Callback<T>) => void
```

## Parameters

### Callback

The callback function for the event of receiving server messages by WebSocket.

```tsx
(result: CallbackResult<T>) => void
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
      <td><code>CallbackResult&lt;T&gt;</code></td>
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
      <td>data</td>
      <td><code>T</code></td>
      <td>Messages returned by the server</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.connectSocket({
  url: 'test.php'
})
Taro.onSocketMessage(function (res) {
  console.log('receive msg：' + res.data)
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.onSocketMessage | ✔️ | ✔️ | ✔️ |  |  |
