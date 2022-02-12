---
title: Taro.createWorker(scriptPath)
sidebar_label: createWorker
---

创建一个 Worker 线程。目前限制最多只能创建一个 Worker，创建下一个 Worker 前请先调用 [Worker.terminate](/docs/apis/worker/Worker#terminate)

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

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
