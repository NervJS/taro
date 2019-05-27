---
title: Taro.addInterceptor(function func)
sidebar_label: addInterceptor
---


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



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 轻应用 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.addInterceptor | ✔️ | ✔️ |  | ✔️ | ✔️ | ✔️ | ✔️ |

