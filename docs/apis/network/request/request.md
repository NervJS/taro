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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>url</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>开发者服务器接口地址</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>U</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>请求的参数</td>
    </tr>
    <tr>
      <td>dataType</td>
      <td><code>&quot;json&quot; | &quot;其他&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>返回的数据格式</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>设置请求的 header，header 中不能设置 Referer。<br /><br /><code>content-type</code> 默认为 <code>application/json</code></td>
    </tr>
    <tr>
      <td>method</td>
      <td><code>&quot;OPTIONS&quot; | &quot;GET&quot; | &quot;HEAD&quot; | &quot;POST&quot; | &quot;PUT&quot; | &quot;DELETE&quot; | &quot;TRACE&quot; | &quot;CONNECT&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>HTTP 请求方法</td>
    </tr>
    <tr>
      <td>responseType</td>
      <td><code>&quot;text&quot; | &quot;arraybuffer&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>响应的数据类型</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult&lt;any&gt;) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>jsonp</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端是否使用jsonp方式获取数据</td>
    </tr>
    <tr>
      <td>jsonpCache</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端 jsonp 请求 url 是否需要被缓存</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>&quot;no-cors&quot; | &quot;cors&quot; | &quot;same-origin&quot;</code></td>
      <td style="text-align:center"><code>same-origin</code></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端是否允许跨域请求</td>
    </tr>
    <tr>
      <td>credentials</td>
      <td><code>&quot;same-origin&quot; | &quot;include&quot; | &quot;omit&quot;</code></td>
      <td style="text-align:center"><code>omit</code></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端是否携带 Cookie</td>
    </tr>
    <tr>
      <td>cache</td>
      <td><code>&quot;default&quot; | &quot;no-cache&quot; | &quot;reload&quot; | &quot;force-cache&quot; | &quot;only-if-cached&quot;</code></td>
      <td style="text-align:center"><code>default</code></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端缓存模式</td>
    </tr>
    <tr>
      <td>timeout</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>2000</code></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端请求响应超时时间</td>
    </tr>
    <tr>
      <td>retryTimes</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>2</code></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端请求重试次数</td>
    </tr>
    <tr>
      <td>backup</td>
      <td><code>string | string[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端请求的兜底接口</td>
    </tr>
    <tr>
      <td>dataCheck</td>
      <td><code>() =&gt; boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端请求响应的数据校验函数，若返回 false，则请求兜底接口，若无兜底接口，则报请求失败</td>
    </tr>
    <tr>
      <td>useStore</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端请求是否使用缓存</td>
    </tr>
    <tr>
      <td>storeCheckKey</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端请求缓存校验的 key</td>
    </tr>
    <tr>
      <td>storeSign</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端请求缓存签名</td>
    </tr>
    <tr>
      <td>storeCheck</td>
      <td><code>() =&gt; boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>设置 H5 端请求校验函数，一般不需要设置</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>T</code></td>
      <td>开发者服务器返回的数据</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>开发者服务器返回的 HTTP Response Header</td>
    </tr>
    <tr>
      <td>statusCode</td>
      <td><code>number</code></td>
      <td>开发者服务器返回的 HTTP 状态码</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### dataType

返回的数据格式

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>json</td>
      <td>返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse</td>
    </tr>
    <tr>
      <td>其他</td>
      <td>不对返回的内容进行 JSON.parse</td>
    </tr>
  </tbody>
</table>

### method

HTTP 请求方法

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>OPTIONS</td>
      <td>HTTP 请求 OPTIONS</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>HTTP 请求 GET</td>
    </tr>
    <tr>
      <td>HEAD</td>
      <td>HTTP 请求 HEAD</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>HTTP 请求 POST</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>HTTP 请求 PUT</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>HTTP 请求 DELETE</td>
    </tr>
    <tr>
      <td>TRACE</td>
      <td>HTTP 请求 TRACE</td>
    </tr>
    <tr>
      <td>CONNECT</td>
      <td>HTTP 请求 CONNECT</td>
    </tr>
  </tbody>
</table>

### responseType

响应的数据类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>text</td>
      <td>响应的数据为文本</td>
    </tr>
    <tr>
      <td>arraybuffer</td>
      <td>响应的数据为 ArrayBuffer</td>
    </tr>
  </tbody>
</table>

### cors_mode

跨域策略

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>no-cors</td>
      <td>跨域请求将获取不透明的响应</td>
    </tr>
    <tr>
      <td>cors</td>
      <td>允许跨域请求</td>
    </tr>
    <tr>
      <td>same-origin</td>
      <td>请求总是向当前的源发起的</td>
    </tr>
  </tbody>
</table>

### credentials

证书

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>include</td>
      <td>不论是不是跨域的请求,总是发送请求资源域在本地的 cookies、 HTTP Basic authentication 等验证信息</td>
    </tr>
    <tr>
      <td>same-origin</td>
      <td>只有当URL与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息</td>
    </tr>
    <tr>
      <td>omit</td>
      <td>从不发送cookies</td>
    </tr>
  </tbody>
</table>

### cache

缓存策略

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>浏览器从HTTP缓存中寻找匹配的请求</td>
    </tr>
    <tr>
      <td>no-cache</td>
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
