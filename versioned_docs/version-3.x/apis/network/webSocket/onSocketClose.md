---
title: Taro.onSocketClose(callback)
sidebar_label: onSocketClose
---

监听 WebSocket 连接关闭事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketClose.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

WebSocket 连接关闭事件的回调函数

```tsx
(result: CallbackResult) => void
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
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

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

## 示例代码

```tsx
Taro.connectSocket({
  url: 'test.php'
})
//注意这里有时序问题，
//如果 Taro.connectSocket 还没回调 Taro.onSocketOpen，而先调用 Taro.closeSocket，那么就做不到关闭 WebSocket 的目的。
//必须在 WebSocket 打开期间调用 Taro.closeSocket 才能关闭。
Taro.onSocketOpen(function () {
  Taro.closeSocket()
})
Taro.onSocketClose(function (res) {
  console.log('WebSocket 已关闭！')
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.onSocketClose | ✔️ | ✔️ | ✔️ |  |  |
