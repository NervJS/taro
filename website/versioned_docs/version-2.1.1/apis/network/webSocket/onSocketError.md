---
title: Taro.onSocketError(callback)
sidebar_label: onSocketError
id: version-2.1.1-onSocketError
original_id: onSocketError
---

监听 WebSocket 错误事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketError.html)

## 类型

```tsx
(callback: (result: Callback) => void) => void
```

## 参数

### Callback

WebSocket 错误事件的回调函数

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.connectSocket({
  url: 'test.php'
})
Taro.onSocketOpen(function (res){
  console.log('WebSocket连接已打开！')
})
Taro.onSocketError(function (res){
  console.log('WebSocket连接打开失败，请检查！')
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.onSocketError | ✔️ | ✔️ | ✔️ |  |  |
