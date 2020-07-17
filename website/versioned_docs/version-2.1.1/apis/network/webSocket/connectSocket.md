---
title: Taro.connectSocket(option)
sidebar_label: connectSocket
id: version-2.1.1-connectSocket
original_id: connectSocket
---

创建一个 WebSocket 连接。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。

**并发数**
- 1.7.0 及以上版本，最多可以同时存在 5 个 WebSocket 连接。
- 1.7.0 以下版本，一个小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html)

## 类型

```tsx
(option: Option) => Promise<SocketTask>
```

## 参数

### Option

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
      <td>url</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>开发者服务器 wss 接口地址</td>
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
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>HTTP Header，Header 中不能设置 Referer</td>
    </tr>
    <tr>
      <td>protocols</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">否</td>
      <td>子协议数组</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>tcpNoDelay</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>建立 TCP 连接的时候的 TCP_NODELAY 设置</td>
    </tr>
  </tbody>
</table>

## 示例代码

### 示例 1

```tsx
Taro.connectSocket({
  url: 'wss://example.qq.com',
  header:{
    'content-type': 'application/json'
  },
  protocols: ['protocol1']
})
```

### 示例 2

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

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.connectSocket | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
