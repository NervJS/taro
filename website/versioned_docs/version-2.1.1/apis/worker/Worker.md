---
title: Worker
sidebar_label: Worker
id: version-2.1.1-Worker
original_id: Worker
---

## 方法

### onMessage

监听主线程/Worker 线程向当前线程发送的消息的事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.onMessage.html)

```tsx
(callback: OnMessageCallback) => void
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
      <td><code>OnMessageCallback</code></td>
      <td>主线程/Worker 线程向当前线程发送的消息的事件的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.onMessage | ✔️ |  |  |

### postMessage

向主线程/Worker 线程发送的消息。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.postMessage.html)

```tsx
(message: Record<string, any>) => void
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
      <td>message</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>需要发送的消息，必须是一个可序列化的 JavaScript key-value 形式的对象。</td>
    </tr>
  </tbody>
</table>

#### 示例代码

worker 线程中

```tsx
worker.postMessage({
  msg: 'hello from worker'
})
```

主线程中

```tsx
const worker = Taro.createWorker('workers/request/index.js')
worker.postMessage({
  msg: 'hello from main'
})
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.postMessage | ✔️ |  |  |

### terminate

结束当前 Worker 线程。仅限在主线程 worker 对象上调用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.terminate.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.terminate | ✔️ |  |  |

## 参数

### OnMessageCallback

```tsx
(result: OnMessageCallbackResult) => void
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
      <td><code>OnMessageCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnMessageCallbackResult

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
      <td>message</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>主线程/Worker 线程向当前线程发送的消息</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.onMessage | ✔️ |  |  |
| Worker.postMessage | ✔️ |  |  |
| Worker.terminate | ✔️ |  |  |
