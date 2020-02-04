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

| 参数 | 类型 |
| --- | --- |
| result | `OpenCallbackResult` |

### OpenCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| header | `Record<string, any>` | 连接成功的 HTTP 响应 Header |

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
