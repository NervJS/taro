---
title: UploadTask
sidebar_label: UploadTask
---

Listens on the upload progress change event and cancels upload tasks.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/upload/UploadTask.html)

## Methods

### abort

Aborts upload tasks.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/upload/UploadTask.abort.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UploadTask.abort | ✔️ |  |  |

### offHeadersReceived

Listens on HTTP Response Header event, which will be earlier than the request completion event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/upload/UploadTask.offHeadersReceived.html)

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
| UploadTask.offHeadersReceived | ✔️ |  |  |

### offProgressUpdate

Un-listens on the upload progress change event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/upload/UploadTask.offProgressUpdate.html)

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
      <td>The callback function for the upload progress change event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UploadTask.offProgressUpdate | ✔️ |  |  |

### onHeadersReceived

Listens on HTTP Response Header event, which will be earlier than the request completion event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/upload/UploadTask.onHeadersReceived.html)

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
| UploadTask.onHeadersReceived | ✔️ |  |  |

### headersReceived

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
      <td>The callback function for the HTTP Response Header event</td>
    </tr>
  </tbody>
</table>

### onProgressUpdate

Listens on the upload progress change event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/upload/UploadTask.onProgressUpdate.html)

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
      <td>The callback function for the upload progress change event.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UploadTask.onProgressUpdate | ✔️ |  |  |

### progress

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
      <td>The callback function for the upload progress change event.</td>
    </tr>
  </tbody>
</table>

## Parameters

### OffHeadersReceivedCallback

The callback function for the HTTP Response Header event

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

The callback function for the upload progress change event.

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

The callback function for the upload progress change event.

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
      <td>Upload progress percentage</td>
    </tr>
    <tr>
      <td>totalBytesExpectedToSend</td>
      <td><code>number</code></td>
      <td>The length of data expected to be uploaded, in bytes</td>
    </tr>
    <tr>
      <td>totalBytesSent</td>
      <td><code>number</code></td>
      <td>The length of uploaded data, in bytes</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UploadTask.abort | ✔️ |  |  |
| UploadTask.offHeadersReceived | ✔️ |  |  |
| UploadTask.offProgressUpdate | ✔️ |  |  |
| UploadTask.onHeadersReceived | ✔️ |  |  |
| UploadTask.onProgressUpdate | ✔️ |  |  |
