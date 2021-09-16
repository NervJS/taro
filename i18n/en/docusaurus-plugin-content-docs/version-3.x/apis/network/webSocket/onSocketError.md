---
title: Taro.onSocketError(callback)
sidebar_label: onSocketError
---

Listens on the WebSocket error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/wx.onSocketError.html)

## Type

```tsx
(callback: (result: Callback) => void) => void
```

## Parameters

### Callback

The callback function for the WebSocket error event.

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.connectSocket({
  url: 'test.php'
})
Taro.onSocketOpen(function (res){
  console.log('WebSocket connection is open!')
})
Taro.onSocketError(function (res){
  console.log('WebSocket connection failed to open, please check!')
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.onSocketError | ✔️ | ✔️ | ✔️ |  |  |
