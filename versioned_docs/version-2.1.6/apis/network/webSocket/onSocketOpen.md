---
title: Taro.onSocketOpen(callback)
sidebar_label: onSocketOpen
---

监听 WebSocket 连接打开事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketOpen.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

WebSocket 连接打开事件的回调函数

```tsx
(result: OpenCallbackResult) => void
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
      <td><code>OpenCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OpenCallbackResult

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

## 示例代码

```tsx
Taro.connectSocket({
  url: 'test.php'
})
Taro.onSocketOpen(function (res) {
  console.log('WebSocket连接已打开！')
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.onSocketOpen | ✔️ | ✔️ | ✔️ |  |  |
