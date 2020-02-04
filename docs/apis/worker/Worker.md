---
title: Worker
sidebar_label: Worker
---

## 方法

### onMessage

监听主线程/Worker 线程向当前线程发送的消息的事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.onMessage.html)

```tsx
(callback: OnMessageCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnMessageCallback` | 主线程/Worker 线程向当前线程发送的消息的事件的回调函数 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| message | `Record<string, any>` | 需要发送的消息，必须是一个可序列化的 JavaScript key-value 形式的对象。 |

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

| 参数 | 类型 |
| --- | --- |
| result | `OnMessageCallbackResult` |

### OnMessageCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| message | `Record<string, any>` | 主线程/Worker 线程向当前线程发送的消息 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Worker.onMessage | ✔️ |  |  |
| Worker.postMessage | ✔️ |  |  |
| Worker.terminate | ✔️ |  |  |
