---
title: CameraFrameListener
sidebar_label: CameraFrameListener
---

CameraContext.onCameraFrame() 返回的监听器。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.html)

## 方法

### start

开始监听帧数据

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.start.html)

```tsx
(option?: StartOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StartOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraFrameListener.start | ✔️ |  |  |

### stop

停止监听帧数据

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.stop.html)

```tsx
(option?: StopOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StopOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraFrameListener.stop | ✔️ |  |  |

## 参数

### StartOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### StopOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraFrameListener.start | ✔️ |  |  |
| CameraFrameListener.stop | ✔️ |  |  |
