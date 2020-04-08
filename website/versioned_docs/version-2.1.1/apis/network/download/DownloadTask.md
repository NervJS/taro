---
title: DownloadTask
sidebar_label: DownloadTask
id: version-2.1.1-DownloadTask
original_id: DownloadTask
---

## 方法

### abort

中断下载任务

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.abort.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.abort | ✔️ |  |  |

### offHeadersReceived

取消监听 HTTP Response Header 事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.offHeadersReceived.html)

```tsx
(callback: OffHeadersReceivedCallback) => void
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
      <td><code>OffHeadersReceivedCallback</code></td>
      <td>HTTP Response Header 事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.offHeadersReceived | ✔️ |  |  |

### offProgressUpdate

取消监听下载进度变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.offProgressUpdate.html)

```tsx
(callback: OffProgressUpdateCallback) => void
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
      <td><code>OffProgressUpdateCallback</code></td>
      <td>下载进度变化事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.offProgressUpdate | ✔️ |  |  |

### onHeadersReceived

监听 HTTP Response Header 事件。会比请求完成事件更早

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.onHeadersReceived.html)

```tsx
(callback: OnHeadersReceivedCallback) => void
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
      <td><code>OnHeadersReceivedCallback</code></td>
      <td>HTTP Response Header 事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.onHeadersReceived | ✔️ |  |  |

### onProgressUpdate

监听下载进度变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.onProgressUpdate.html)

```tsx
(callback: OnProgressUpdateCallback) => void
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
      <td><code>OnProgressUpdateCallback</code></td>
      <td>下载进度变化事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.onProgressUpdate | ✔️ |  |  |

## 参数

### OffHeadersReceivedCallback

HTTP Response Header 事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OffProgressUpdateCallback

下载进度变化事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnHeadersReceivedCallback

HTTP Response Header 事件的回调函数

```tsx
(result: OnHeadersReceivedCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnHeadersReceivedCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnProgressUpdateCallback

下载进度变化事件的回调函数

```tsx
(result: OnProgressUpdateCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnProgressUpdateCallbackResult</code></td>
    </tr>
  </tbody>
</table>

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

### OnProgressUpdateCallbackResult

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
      <td>progress</td>
      <td><code>number</code></td>
      <td>下载进度百分比</td>
    </tr>
    <tr>
      <td>totalBytesExpectedToWrite</td>
      <td><code>number</code></td>
      <td>预期需要下载的数据总长度，单位 Bytes</td>
    </tr>
    <tr>
      <td>totalBytesWritten</td>
      <td><code>number</code></td>
      <td>已经下载的数据长度，单位 Bytes</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.abort | ✔️ |  |  |
| DownloadTask.offHeadersReceived | ✔️ |  |  |
| DownloadTask.offProgressUpdate | ✔️ |  |  |
| DownloadTask.onHeadersReceived | ✔️ |  |  |
| DownloadTask.onProgressUpdate | ✔️ |  |  |
