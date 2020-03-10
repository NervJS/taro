---
title: Taro.createWorker(scriptPath)
sidebar_label: createWorker
---

创建一个 Worker 线程。目前限制最多只能创建一个 Worker，创建下一个 Worker 前请先调用 [Worker.terminate](https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.terminate.html)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/worker/wx.createWorker.html)

## 类型

```tsx
(scriptPath: string) => Worker
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scriptPath | `string` | worker 入口文件的**绝对路径** |

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
