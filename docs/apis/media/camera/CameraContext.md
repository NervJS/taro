---
title: CameraContext
sidebar_label: CameraContext
---

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.html)

## 方法

### startRecord

开始录像

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.startRecord.html)

```tsx
(option: StartRecordOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StartRecordOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.startRecord | ✔️ |  |  |

### stopRecord

结束录像

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.stopRecord.html)

```tsx
(option?: StopRecordOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StopRecordOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.stopRecord | ✔️ |  |  |

### takePhoto

拍摄照片

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.takePhoto.html)

```tsx
(option: TakePhotoOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `TakePhotoOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.takePhoto | ✔️ |  |  |

### onCameraFrame

获取 Camera 实时帧数据

****

注： 使用该接口需同时在 [camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件属性中指定 frame-size。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.onCameraFrame.html)

```tsx
(callback: OnCameraFrameCallback) => CameraFrameListener
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnCameraFrameCallback` | 回调函数 |

#### 示例代码

```tsx
const context = wx.createCameraContext()
const listener = context.onCameraFrame((frame) => {
  console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
})
listener.start()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.onCameraFrame | ✔️ |  |  |

## 参数

### StartRecordOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| timeoutCallback | `StartRecordTimeoutCallback` | 否 | 超过30s或页面 `onHide` 时会结束录像 |

### StartRecordTimeoutCallback

超过30s或页面 `onHide` 时会结束录像

```tsx
(result: StartRecordTimeoutCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `StartRecordTimeoutCallbackResult` |

### StartRecordTimeoutCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempThumbPath | `string` | 封面图片文件的临时路径 |
| tempVideoPath | `string` | 视频的文件的临时路径 |

### StopRecordOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: StopRecordSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### StopRecordSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempThumbPath | `string` | 封面图片文件的临时路径 |
| tempVideoPath | `string` | 视频的文件的临时路径 |
| errMsg | `string` | 调用结果 |

### TakePhotoOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| quality | "high" or "normal" or "low" | 否 | 成像质量 |
| success | `(result: TakePhotoSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### TakePhotoSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempImagePath | `string` | 照片文件的临时路径，安卓是jpg图片格式，ios是png |
| errMsg | `string` | 调用结果 |

### OnCameraFrameCallback

回调函数

```tsx
(result: OnCameraFrameCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnCameraFrameCallbackResult` |

### OnCameraFrameCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `ArrayBuffer` | 图像像素点数据，一维数组，每四项表示一个像素点的 rgba |
| height | `number` | 图像数据矩形的高度 |
| width | `number` | 图像数据矩形的宽度 |

### quality

| 参数 | 说明 |
| --- | --- |
| high | 高质量 |
| normal | 普通质量 |
| low | 低质量 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.startRecord | ✔️ |  |  |
| CameraContext.stopRecord | ✔️ |  |  |
| CameraContext.takePhoto | ✔️ |  |  |
| CameraContext.onCameraFrame | ✔️ |  |  |
