---
title: Taro.createWorker(scriptPath)
sidebar_label: createWorker
---

Creates a [worker thread](https://developers.weixin.qq.com/miniprogram/en/dev/framework/workers.html). You can create only one worker at most. Call [Worker.terminate](https://developers.weixin.qq.com/miniprogram/en/dev/api/worker/Worker.terminate.html) before creating another worker.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/worker/wx.createWorker.html)

## Type

```tsx
(scriptPath: string) => Worker
```

## Parameters

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
      <td>scriptPath</td>
      <td><code>string</code></td>
      <td>The <strong>absolute path</strong> to the worker entry file.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const worker = Taro.createWorker('workers/request/index.js')
  worker.onMessage(function (res) {
  console.log(res)
})
worker.postMessage({
  msg: 'hello worker'
})
worker.terminate()
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createWorker | ✔️ |  |  |
