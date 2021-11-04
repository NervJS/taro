---
title: Taro.request(OBJECT)
sidebar_label: request
---

发起网络请求，支持 `Promise` 化使用。

> 暂不支持使用 [RequestTask.onHeadersReceived(function callback)](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.onHeadersReceived.html) 和 [RequestTask.offHeadersReceived(function callback)](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.offHeadersReceived.html) 方法。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| url | String | 是 |  | 开发者服务器接口地址 |
| data | Object/String/ArrayBuffer | 否 |  |请求的参数 |
| header | Object | 否 |  | 设置请求的 header，header 中不能设置 Referer。 |
| method | String | 否 | GET | （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT |
| dataType | String | 否 | json | 如果设为 json，会尝试对返回的数据做一次 JSON.parse |
| responseType | String | 否 | text | 设置响应的数据类型。合法值：text、arraybuffer |
| success | Function | 否 |  | 接口调用成功的回调函数 |
| fail | Function | 否 |  | 接口调用失败的回调函数 |
| complete | Function | 否 |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

**H5 端附加参数说明：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| jsonp | String/Boolean | 否 |  | 使用 jsonp，且使用此值作为回调函数名 |
| jsonpCache | Boolean | 否 | false | jsonp 请求 url 是否需要被缓存 |
| mode | String | 否 | same-origin | 是否允许跨域请求。有效值：no-cors, cors, same-origin |
| credentials | String | 否 | omit | 是否携带 Cookie。有效值：include, same-origin, omit |
| cache | String | 否 | default | 缓存模式。有效值：default, no-cache, reload, force-cache, only-if-cached |

**success 返回参数说明：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| data | Object/String/ArrayBuffer | 开发者服务器返回的数据 |
| statusCode | Number | 开发者服务器返回的 HTTP 状态码 |
| header | Object | 开发者服务器返回的 HTTP Response Header |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.request({
  url: 'http://localhost:8080/test',
  data: {
    foo: 'foo',
    bar: 10
  },
  header: {
    'content-type': 'application/json'
  }
})
  .then(res => console.log(res.data))
```

## 小程序端使用 RequestTask.abort()

```jsx
const requestTask = Taro.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
    x: '' ,
    y: ''
  },
  header: {
    'content-type': 'application/json'
  },
  success (res) {
    console.log(res.data)
  }
})
requestTask.abort() // 取消请求任务
```

## API支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 轻应用 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.request | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
