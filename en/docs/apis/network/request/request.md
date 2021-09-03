---
title: Taro.request(option)
sidebar_label: request
---

Initiates an HTTPS request.Read [related instructions](https://developers.weixin.qq.com/miniprogram/en/dev/framework/ability/network.html) before use.

**data 参数说明** 最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：
- Data from the `GET` method is converted to a query string (`encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...`).
- Data from the `POST` method with `header['content-type']` being `application/json` is serialized into the JSON format.
- Data from the `POST` method with `header['content-type']` being `application/x-www-form-urlencoded` is converted to a query string (`encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...`)

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)

## Type

```tsx
<T = any, U = any>(option: Option<U>) => RequestTask<T>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>url</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Developer server API URL</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Request parameter</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>U</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The returned data format</td>
    </tr>
    <tr>
      <td>dataType</td>
      <td><code>&quot;json&quot; | &quot;other&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The response data format</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>HTTP request method</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sets request Header.Referer is not available in Header.<br /><br /><code>content-type</code> is <code>application/json</code>by default.</td>
    </tr>
    <tr>
      <td>method</td>
      <td><code>&quot;OPTIONS&quot; | &quot;GET&quot; | &quot;HEAD&quot; | &quot;POST&quot; | &quot;PUT&quot; | &quot;DELETE&quot; | &quot;TRACE&quot; | &quot;CONNECT&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify whether to use jsonp to fetch data on the H5 side</td>
    </tr>
    <tr>
      <td>responseType</td>
      <td><code>&quot;text&quot; | &quot;arraybuffer&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether data fetched using jsonp should be cached on the H5 side</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult&lt;any&gt;) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether cross-domain requests are allowed on the H5 side</td>
    </tr>
    <tr>
      <td>jsonp</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify whether to carry cookies on the H5 side</td>
    </tr>
    <tr>
      <td>jsonpCache</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the cache mode on the H5 side</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>&quot;no-cors&quot; | &quot;cors&quot; | &quot;same-origin&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>same-origin</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the request timeout on the H5 side</td>
    </tr>
    <tr>
      <td>credentials</td>
      <td><code>&quot;same-origin&quot; | &quot;include&quot; | &quot;omit&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>omit</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the number of request retries on the H5 side</td>
    </tr>
    <tr>
      <td>cache</td>
      <td><code>&quot;default&quot; | &quot;no-cache&quot; | &quot;reload&quot; | &quot;force-cache&quot; | &quot;only-if-cached&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>default</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the backup requestion for requests on the H5 side</td>
    </tr>
    <tr>
      <td>timeout</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>2000</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify the data validation function for the request response on the H5 side, and if the result is false, request backup requestion.</td>
    </tr>
    <tr>
      <td>retryTimes</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>2</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify whether the request on the H5 side uses caching.</td>
    </tr>
    <tr>
      <td>backup</td>
      <td><code>string | string[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Set the key for the request cache checks on the H5 side</td>
    </tr>
    <tr>
      <td>dataCheck</td>
      <td><code>() =&gt; boolean</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Set the request cache signature on the H5 side</td>
    </tr>
    <tr>
      <td>useStore</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Set the request checksum function on the H5 side, generally not required</td>
    </tr>
    <tr>
      <td>storeCheckKey</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
      <td>设置 H5 端请求缓存校验的 key</td>
    </tr>
    <tr>
      <td>storeSign</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>The callback function for a failed API call</td>
      <td>设置 H5 端请求缓存签名</td>
    </tr>
    <tr>
      <td>storeCheck</td>
      <td><code>() =&gt; boolean</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>The callback function for a successful API call</td>
      <td>设置 H5 端请求校验函数，一般不需要设置</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>T</code></td>
      <td>Data returned by the developer server</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>HTTP Response Header returned by the developer server</td>
    </tr>
    <tr>
      <td>statusCode</td>
      <td><code>number</code></td>
      <td>HTTP status code returned by the developer server</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### dataType

返回的数据格式

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>json</td>
      <td>The returned data is in the JSON format. Call JSON.parse on the returned data.</td>
    </tr>
    <tr>
      <td>Others</td>
      <td>Do not call JSON.parse on the returned data.</td>
    </tr>
  </tbody>
</table>

### method

Valid values of object.dataType

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>OPTIONS</td>
      <td>HTTP request OPTIONS</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>HTTP request GET</td>
    </tr>
    <tr>
      <td>HEAD</td>
      <td>HTTP request HEAD</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>HTTP request POST</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>HTTP request PUT</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>HTTP request DELETE</td>
    </tr>
    <tr>
      <td>TRACE</td>
      <td>HTTP request TRACE</td>
    </tr>
    <tr>
      <td>CONNECT</td>
      <td>HTTP request CONNECT</td>
    </tr>
  </tbody>
</table>

### responseType

Valid values of object.method

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>text</td>
      <td>The response data is in the text format.</td>
    </tr>
    <tr>
      <td>arraybuffer</td>
      <td>The response data is in the ArrayBuffer format.</td>
    </tr>
  </tbody>
</table>

### cors_mode

Valid values of object.responseType

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>no-cors</td>
      <td>Cross-domain requests will get an opaque response</td>
    </tr>
    <tr>
      <td>cors</td>
      <td>Allow cross-domain requests</td>
    </tr>
    <tr>
      <td>same-origin</td>
      <td>Requests are always made to the current source</td>
    </tr>
  </tbody>
</table>

### credentials

Valid values of CORS mode

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>include</td>
      <td>Always send authentication information such as cookies, HTTP Basic authentication, etc. local to the requested resource domain.</td>
    </tr>
    <tr>
      <td>same-origin</td>
      <td>Authentication information such as cookies, HTTP Basic authentication, etc. is only sent if the URL is the same source as the response script.</td>
    </tr>
    <tr>
      <td>omit</td>
      <td>No cookies are sent.</td>
    </tr>
  </tbody>
</table>

### cache

Valid values of credentials

<table>
  <thead>
    <tr>
      <th>Data Parameters</th>
      <th>WeChat Mini-Program</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>浏览器从HTTP缓存中寻找匹配的请求</td>
    </tr>
    <tr>
      <td>No</td>
      <td>浏览器在其HTTP缓存中寻找匹配的请求</td>
    </tr>
    <tr>
      <td>reload</td>
      <td>浏览器直接从远程服务器获取资源，不查看缓存，然后使用下载的资源更新缓存</td>
    </tr>
    <tr>
      <td>force-cache</td>
      <td>浏览器在其HTTP缓存中寻找匹配的请求</td>
    </tr>
    <tr>
      <td>only-if-cached</td>
      <td>浏览器在其HTTP缓存中寻找匹配的请求</td>
    </tr>
  </tbody>
</table>

## Sample Code

### Example 2

```tsx
Taro.request({
  url: 'test.php', // This value for demonstration purposes only is not a real API URL. data: {
    x: '',
    y: ''
  },
  header: {
    'content-type': 'application/json' // Default value
  },
  success: function (res) {
    console.log(res.data)
  }
})
```

### Example 1

async/await 用法：

```tsx
const res = await Taro.request(params)
```

## API Support

|     API      | QQ Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ 小程序 | H5 | React Native |
|:------------:|:---------------:|:-------------------:|:-------------------:|:----------------------:|:------:|:--:|:------------:|
| Taro.request |       ✔️        |         ✔️          |         ✔️          |           ✔️           |   ✔️   | ✔️ |      ✔️      |
