---
title: RequestTask
sidebar_label: RequestTask
id: version-2.1.1-RequestTask
original_id: RequestTask
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

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RequestTask.abort | ✔️ |  |  |

### offHeadersReceived

取消监听 HTTP Response Header 事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.offHeadersReceived.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

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
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>HTTP Response Header 事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RequestTask.offHeadersReceived | ✔️ |  |  |

### onHeadersReceived

监听 HTTP Response Header 事件。会比请求完成事件更早

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.onHeadersReceived.html)

```tsx
(callback: (result: OnHeadersReceivedCallbackResult) => void) => void
```

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
      <td>callback</td>
      <td><code>(result: OnHeadersReceivedCallbackResult) =&gt; void</code></td>
      <td>HTTP Response Header 事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RequestTask.onHeadersReceived | ✔️ |  |  |

## 参数

### OnHeadersReceivedCallbackResult

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
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>开发者服务器返回的 HTTP Response Header</td>
    </tr>
  </tbody>
</table>

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

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RequestTask.abort | ✔️ |  |  |
| RequestTask.offHeadersReceived | ✔️ |  |  |
| RequestTask.onHeadersReceived | ✔️ |  |  |
