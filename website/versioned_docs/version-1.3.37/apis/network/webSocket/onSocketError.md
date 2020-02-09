---
title: Taro.onSocketError(callback)
sidebar_label: onSocketError
id: version-1.3.37-onSocketError
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

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |

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
