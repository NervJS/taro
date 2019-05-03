---
title: 发起请求
sidebar_label: 发起请求
---

## Taro.request(OBJECT)

发起网络请求，支持 `Promise` 化使用。

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

**示例代码：**

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

## 拦截器

> 自 `1.2.16` 开始支持

可以使用拦截器在请求发出前或发出后做一些额外操作。

在调用 `Taro.request` 发起请求之前，调用 `Taro.addInterceptor` 方法为请求添加拦截器，拦截器的调用顺序遵循洋葱模型。

拦截器是一个函数，接受 chain 对象作为参数。chain 对象中含有 **requestParmas** 属性，代表请求参数。拦截器内最后需要调用 `chain.proceed(requestParams)` 以调用下一个拦截器或发起请求。

拦截器例子：

```js
const interceptor = function (chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams
  console.log(`http ${method || 'GET'} --> ${url} data: `, data)
  return chain.proceed(requestParams)
    .then(res => {
      console.log(`http <-- ${url} result:`, res)
      return res
    })
}

Taro.addInterceptor(interceptor)
Taro.request({ url })
```

Taro 提供了两个内置拦截器 `logInterceptor` 与 `timeoutInterceptor`，分别用于打印请求的相关信息和在请求超时时抛出错误。

```js
Taro.addInterceptor(Taro.interceptors.logInterceptor)
Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)
Taro.request({ url })
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 轻应用 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.request | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Taro.addInterceptor | ✔️ | ✔️ |  | ✔️ | ✔️ | ✔️ | ✔️ |
