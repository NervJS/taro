---
title: Taro.onSocketOpen(callback)
sidebar_label: onSocketOpen
---

Listens on the event of enabling the WebSocket connection.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/websocket/wx.onSocketOpen.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the event of enabling the WebSocket connection.

```tsx
(result: OpenCallbackResult) => void
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
      <td><code>OpenCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OpenCallbackResult

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

## Sample Code

```tsx
Taro.connectSocket({
  url: 'test.php'
})
Taro.onSocketOpen(function (res) {
  console.log('WebSocket connection is open！')
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.onSocketOpen | ✔️ | ✔️ | ✔️ |  |  |
