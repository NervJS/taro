---
title: RequestTask
sidebar_label: RequestTask
---

Requests tasks over the network.

## Methods

### abort

Aborts requesting tasks.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/request/RequestTask.abort.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RequestTask.abort | ✔️ |  |  |

### offHeadersReceived

Un-listens on the HTTP Response Header event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/request/RequestTask.offHeadersReceived.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

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
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the HTTP Response Header event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RequestTask.offHeadersReceived | ✔️ |  |  |

### onHeadersReceived

Listens on HTTP Response Header event, which will be earlier than the request completion event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/request/RequestTask.onHeadersReceived.html)

```tsx
(callback: (result: OnHeadersReceivedCallbackResult) => void) => void
```

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
      <td>callback</td>
      <td><code>(result: OnHeadersReceivedCallbackResult) =&gt; void</code></td>
      <td>The callback function for the HTTP Response Header event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RequestTask.onHeadersReceived | ✔️ |  |  |

## Parameters

### OnHeadersReceivedCallbackResult

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
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>HTTP Response Header returned by the developer server</td>
    </tr>
  </tbody>
</table>

## Sample Code

### Example 1

```tsx
const requestTask = Taro.request({
  url: 'test.php', // This value for demonstration purposes only is not a real API URL.
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

### Example 2

```tsx
const requestTask = Taro.request({
  url: 'test.php', // This value for demonstration purposes only is not a real API URL.
  data: {
    x: '' ,
    y: ''
  },
  header: {
    'content-type': 'application/json' // Default value
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

### Example 3

```tsx
const requestTask = Taro.request(params)
const res = await requestTask
requestTask.abort()
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RequestTask.abort | ✔️ |  |  |
| RequestTask.offHeadersReceived | ✔️ |  |  |
| RequestTask.onHeadersReceived | ✔️ |  |  |
