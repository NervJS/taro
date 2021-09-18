---
title: DownloadTask
sidebar_label: DownloadTask
---

## Methods

### abort

Aborts download tasks.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/download/DownloadTask.abort.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.abort | ✔️ |  | ✔️ |

### offHeadersReceived

Un-listens on the HTTP Response Header event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/download/DownloadTask.offHeadersReceived.html)

```tsx
(callback: OffHeadersReceivedCallback) => void
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
      <td><code>OffHeadersReceivedCallback</code></td>
      <td>The callback function for the HTTP Response Header event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.offHeadersReceived | ✔️ |  |  |

### offProgressUpdate

Un-listens on download progress change events.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/download/DownloadTask.offProgressUpdate.html)

```tsx
(callback: OffProgressUpdateCallback) => void
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
      <td><code>OffProgressUpdateCallback</code></td>
      <td>The callback function for the download progress change event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.offProgressUpdate | ✔️ |  | ✔️ |

### onHeadersReceived

Listens on HTTP Response Header event, which will be earlier than the request completion event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/download/DownloadTask.onHeadersReceived.html)

```tsx
(callback: OnHeadersReceivedCallback) => void
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
      <td><code>OnHeadersReceivedCallback</code></td>
      <td>The callback function for the HTTP Response Header event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.onHeadersReceived | ✔️ |  |  |

### onProgressUpdate

Listens on the download progress change event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/download/DownloadTask.onProgressUpdate.html)

```tsx
(callback: OnProgressUpdateCallback) => void
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
      <td><code>OnProgressUpdateCallback</code></td>
      <td>The callback function for the download progress change event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.onProgressUpdate | ✔️ |  | ✔️ |

## Parameters

### OffHeadersReceivedCallback

The callback function for the HTTP Response Header event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the download progress change event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the HTTP Response Header event.

```tsx
(result: OnHeadersReceivedCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the download progress change event.

```tsx
(result: OnProgressUpdateCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

### OnProgressUpdateCallbackResult

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
      <td>progress</td>
      <td><code>number</code></td>
      <td>Download progress percentage</td>
    </tr>
    <tr>
      <td>totalBytesWritten</td>
      <td><code>number</code></td>
      <td>The length of downloaded data, in bytes</td>
    </tr>
    <tr>
      <td>totalBytesExpectedToWrite</td>
      <td><code>number</code></td>
      <td>The length of data expected to be downloaded, in bytes</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| DownloadTask.abort | ✔️ |  | ✔️ |
| DownloadTask.offHeadersReceived | ✔️ |  |  |
| DownloadTask.offProgressUpdate | ✔️ |  | ✔️ |
| DownloadTask.onHeadersReceived | ✔️ |  |  |
| DownloadTask.onProgressUpdate | ✔️ |  | ✔️ |
