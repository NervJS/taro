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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>StartRecordOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>StopRecordOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>TakePhotoOption</code></td>
    </tr>
  </tbody>
</table>

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
      <td><code>OnCameraFrameCallback</code></td>
      <td>回调函数</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>timeoutCallback</td>
      <td><code>StartRecordTimeoutCallback</code></td>
      <td style="text-align:center">否</td>
      <td>超过30s或页面 <code>onHide</code> 时会结束录像</td>
    </tr>
  </tbody>
</table>

### StartRecordTimeoutCallback

超过30s或页面 `onHide` 时会结束录像

```tsx
(result: StartRecordTimeoutCallbackResult) => void
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
      <td><code>StartRecordTimeoutCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### StartRecordTimeoutCallbackResult

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
      <td>tempThumbPath</td>
      <td><code>string</code></td>
      <td>封面图片文件的临时路径</td>
    </tr>
    <tr>
      <td>tempVideoPath</td>
      <td><code>string</code></td>
      <td>视频的文件的临时路径</td>
    </tr>
  </tbody>
</table>

### StopRecordOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: StopRecordSuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### StopRecordSuccessCallbackResult

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
      <td>tempThumbPath</td>
      <td><code>string</code></td>
      <td>封面图片文件的临时路径</td>
    </tr>
    <tr>
      <td>tempVideoPath</td>
      <td><code>string</code></td>
      <td>视频的文件的临时路径</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### TakePhotoOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>quality</td>
      <td><code>&quot;high&quot; | &quot;normal&quot; | &quot;low&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>成像质量</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: TakePhotoSuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### TakePhotoSuccessCallbackResult

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
      <td>tempImagePath</td>
      <td><code>string</code></td>
      <td>照片文件的临时路径，安卓是jpg图片格式，ios是png</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### OnCameraFrameCallback

回调函数

```tsx
(result: OnCameraFrameCallbackResult) => void
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
      <td><code>OnCameraFrameCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnCameraFrameCallbackResult

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
      <td>data</td>
      <td><code>ArrayBuffer</code></td>
      <td>图像像素点数据，一维数组，每四项表示一个像素点的 rgba</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>图像数据矩形的高度</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>图像数据矩形的宽度</td>
    </tr>
  </tbody>
</table>

### quality

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>high</td>
      <td>高质量</td>
    </tr>
    <tr>
      <td>normal</td>
      <td>普通质量</td>
    </tr>
    <tr>
      <td>low</td>
      <td>低质量</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.startRecord | ✔️ |  |  |
| CameraContext.stopRecord | ✔️ |  |  |
| CameraContext.takePhoto | ✔️ |  |  |
| CameraContext.onCameraFrame | ✔️ |  |  |
