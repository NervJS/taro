---
title: Taro.createWorker(scriptPath)
sidebar_label: createWorker
id: version-2.1.1-createWorker
original_id: createWorker
---

创建一个 Worker 线程。目前限制最多只能创建一个 Worker，创建下一个 Worker 前请先调用 [Worker.terminate](https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.terminate.html)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/worker/wx.createWorker.html)

## 类型

```tsx
(scriptPath: string) => Worker
```

## 参数

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
      <td>scriptPath</td>
      <td><code>string</code></td>
      <td>worker 入口文件的<strong>绝对路径</strong></td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const worker = Taro.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
  worker.onMessage(function (res) {
  console.log(res)
})
worker.postMessage({
  msg: 'hello worker'
})
worker.terminate()
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createWorker | ✔️ |  |  |
