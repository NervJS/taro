---
title: Taro.request(option)
sidebar_label: request
---

发起 HTTPS 网络请求。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。

**data 参数说明**
最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：
- 对于 `GET` 方法的数据，会将数据转换成 query string（`encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...`）
- 对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会对数据进行 JSON 序列化
- 对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换成 query string `（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）`

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)

## 类型

```tsx
<T = any, U = any>(option: Option<U>) => RequestTask<T>
```

## 参数

### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| url | `string` |  | 是 | 开发者服务器接口地址 |
| complete | `(res: CallbackResult) => void` |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| data | `U` |  | 否 | 请求的参数 |
| dataType | "json" or "其他" |  | 否 | 返回的数据格式 |
| fail | `(res: CallbackResult) => void` |  | 否 | 接口调用失败的回调函数 |
| header | `Record<string, any>` |  | 否 | 设置请求的 header，header 中不能设置 Referer。<br /><br />`content-type` 默认为 `application/json` |
| method | "OPTIONS" or "GET" or "HEAD" or "POST" or "PUT" or "DELETE" or "TRACE" or "CONNECT" |  | 否 | HTTP 请求方法 |
| responseType | "text" or "arraybuffer" |  | 否 | 响应的数据类型 |
| success | `(result: SuccessCallbackResult<any>) => void` |  | 否 | 接口调用成功的回调函数 |
| jsonp | `boolean` | `false` | 否 | 设置 H5 端是否使用jsonp方式获取数据 |
| jsonpCache | `boolean` | `false` | 否 | 设置 H5 端 jsonp 请求 url 是否需要被缓存 |
| mode | "no-cors" or "cors" or "same-origin" | `same-origin` | 否 | 设置 H5 端是否允许跨域请求 |
| credentials | "same-origin" or "include" or "omit" | `omit` | 否 | 设置 H5 端是否携带 Cookie |
| cache | "default" or "no-cache" or "reload" or "force-cache" or "only-if-cached" | `default` | 否 | 设置 H5 端缓存模式 |
| timeout | `number` | `2000` | 否 | 设置 H5 端请求响应超时时间 |
| retryTimes | `number` | `2` | 否 | 设置 H5 端请求重试次数 |
| backup | string or string[] |  | 否 | 设置 H5 端请求的兜底接口 |
| dataCheck | `() => boolean` |  | 否 | 设置 H5 端请求响应的数据校验函数，若返回 false，则请求兜底接口，若无兜底接口，则报请求失败 |
| useStore | `boolean` | `false` | 否 | 设置 H5 端请求是否使用缓存 |
| storeCheckKey | `string` |  | 否 | 设置 H5 端请求缓存校验的 key |
| storeSign | `string` |  | 否 | 设置 H5 端请求缓存签名 |
| storeCheck | `() => boolean` |  | 否 | 设置 H5 端请求校验函数，一般不需要设置 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `T` | 开发者服务器返回的数据 |
| header | `Record<string, any>` | 开发者服务器返回的 HTTP Response Header |
| statusCode | `number` | 开发者服务器返回的 HTTP 状态码 |
| errMsg | `string` | 调用结果 |

### dataType

返回的数据格式

| 参数 | 说明 |
| --- | --- |
| json | 返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse |
| 其他 | 不对返回的内容进行 JSON.parse |

### method

HTTP 请求方法

| 参数 | 说明 |
| --- | --- |
| OPTIONS | HTTP 请求 OPTIONS |
| GET | HTTP 请求 GET |
| HEAD | HTTP 请求 HEAD |
| POST | HTTP 请求 POST |
| PUT | HTTP 请求 PUT |
| DELETE | HTTP 请求 DELETE |
| TRACE | HTTP 请求 TRACE |
| CONNECT | HTTP 请求 CONNECT |

### responseType

响应的数据类型

| 参数 | 说明 |
| --- | --- |
| text | 响应的数据为文本 |
| arraybuffer | 响应的数据为 ArrayBuffer |

### cors_mode

跨域策略

| 参数 | 说明 |
| --- | --- |
| no-cors | 跨域请求将获取不透明的响应 |
| cors | 允许跨域请求 |
| same-origin | 请求总是向当前的源发起的 |

### credentials

证书

| 参数 | 说明 |
| --- | --- |
| include | 不论是不是跨域的请求,总是发送请求资源域在本地的 cookies、 HTTP Basic authentication 等验证信息 |
| same-origin | 只有当URL与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息 |
| omit | 从不发送cookies |

### cache

缓存策略

| 参数 | 说明 |
| --- | --- |
| default | 浏览器从HTTP缓存中寻找匹配的请求 |
| no-cache | 浏览器在其HTTP缓存中寻找匹配的请求 |
| reload | 浏览器直接从远程服务器获取资源，不查看缓存，然后使用下载的资源更新缓存 |
| force-cache | 浏览器在其HTTP缓存中寻找匹配的请求 |
| only-if-cached | 浏览器在其HTTP缓存中寻找匹配的请求 |

## 示例代码

### 示例 1

```tsx
Taro.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
    x: '',
    y: ''
  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success: function (res) {
    console.log(res.data)
  }
})
```

### 示例 2

async/await 用法：

```tsx
const res = await Taro.request(params)
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.request | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
