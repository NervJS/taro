---
title: Worker
sidebar_label: Worker
---

## Methods

### onMessage

Listens on the event that the main thread/worker thread sends a message to the current thread.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/worker/Worker.onMessage.html)

```tsx
(callback: OnMessageCallback) => void
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
      <td><code>OnMessageCallback</code></td>
      <td>The callback function for the event that the main thread/worker thread sends a message to the current thread.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.onMessage | ✔️ |  |  |

### postMessage

Sends messages to the main thread/worker thread.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/worker/Worker.postMessage.html)

```tsx
(message: Record<string, any>) => void
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
      <td>message</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The message to be sent, which must be a serializable object in the format of JavaScript key-value.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

In the worker thread

```tsx
worker.postMessage({
  msg: 'hello from worker'
})
```

In the main thread

```tsx
const worker = Taro.createWorker('workers/request/index.js')
worker.postMessage({
  msg: 'hello from main'
})
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.postMessage | ✔️ |  |  |

### terminate

Ends the current worker thread. This API can only be called on the worker object in the main thread.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/worker/Worker.terminate.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.terminate | ✔️ |  |  |

## Parameters

### OnMessageCallback

```tsx
(result: OnMessageCallbackResult) => void
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
      <td><code>OnMessageCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnMessageCallbackResult

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
      <td>message</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The message sent by the main thread/worker thread to the current thread</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.onMessage | ✔️ |  |  |
| Worker.postMessage | ✔️ |  |  |
| Worker.terminate | ✔️ |  |  |
