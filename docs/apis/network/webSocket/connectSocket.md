---
title: Taro.connectSocket(OBJECT)
sidebar_label: connectSocket
---


创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 链接。

支持存在最多**两个** WebSocket 链接，每次成功调用 Taro.connectSocket 会返回一个新的 [SocketTask](native-api.md#sockettask)。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| url | String | 是 | 开发者服务器接口地址，必须是 wss 协议 |
| header | Object | 否 | HTTP Header , header 中不能设置 Referer |
| method | String | 否 | 默认是 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT |
| protocols | StringArray | 否 | 子协议数组 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

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



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.connectSocket | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

