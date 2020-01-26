---
title: RequestTask
sidebar_label: RequestTask
---

网络请求任务对象

## 方法

### abort

中断请求任务

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.abort.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| RequestTask.abort | ✔️ |  |  |  |  |  |  |  |

### offHeadersReceived

取消监听 HTTP Response Header 事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.offHeadersReceived.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | HTTP Response Header 事件的回调函数 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| RequestTask.offHeadersReceived | ✔️ |  |  |  |  |  |  |  |

### onHeadersReceived

监听 HTTP Response Header 事件。会比请求完成事件更早

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.onHeadersReceived.html)

```tsx
(callback: (result: OnHeadersReceivedCallbackResult) => void) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(result: OnHeadersReceivedCallbackResult) => void` | HTTP Response Header 事件的回调函数 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| RequestTask.onHeadersReceived | ✔️ |  |  |  |  |  |  |  |

## 参数

### OnHeadersReceivedCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| header | `Record<string, any>` | 开发者服务器返回的 HTTP Response Header |

## 示例代码

### 示例 1

回调函数(Callback)用法：

```tsx
const requestTask = Taro.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
    x: '' ,
    y: ''
  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success: function (res) {
    console.log(res.data)
  }
})
requestTask.abort()
```

### 示例 2

Promise 用法：

```tsx
const requestTask = Taro.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
    x: '' ,
    y: ''
  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success: function (res) {
    console.log(res.data)
  }
})
requestTask.then(res => {
  console.log(res.data)
})
requestTask.abort()
```

### 示例 3

async/await 用法：

```tsx
const requestTask = Taro.request(params)
const res = await requestTask
requestTask.abort()
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| RequestTask.abort | ✔️ |  |  |  |  |  |  |  |
| RequestTask.offHeadersReceived | ✔️ |  |  |  |  |  |  |  |
| RequestTask.onHeadersReceived | ✔️ |  |  |  |  |  |  |  |
