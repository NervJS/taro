---
title: Taro.addInterceptor(callback)
sidebar_label: addInterceptor
---

> Minimum Taro version: 1.2.16

Interceptors can be used to perform additional actions before or after the request is made.

Before calling `Taro.request` to initiate the request, the `Taro.addInterceptor` method is called to add an interceptor to the request. In addition, the order in which interceptors are called follows the onion model.

Taro provides two built-in interceptors, `logInterceptor` and `timeoutInterceptor`, which are used to print information about the request and to throw an error if the request times out, respectively.

## Type

```tsx
(callback: Function) => void
```

## Parameters

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>Function</code></td>
    </tr>
  </tbody>
</table>

## Sample Code

### Example 1

```tsx
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

### Example 2

```tsx
Taro.addInterceptor(Taro.interceptors.logInterceptor)
Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)
Taro.request({ url })
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.addInterceptor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
