---
title: CameraContext
sidebar_label: CameraContext
---

The `CameraContext` instance can be obtained via wx.createCameraContext.

`CameraContext` is bound to the unique camera component on the page to use the `camera` component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/camera/CameraContext.html)

## Methods

### startRecord

Starts video recording.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/camera/CameraContext.startRecord.html)

```tsx
(option: StartRecordOption) => void
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
      <td>option</td>
      <td><code>StartRecordOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.startRecord | ✔️ |  | ✔️ |

### stopRecord

Stops video recording.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/camera/CameraContext.stopRecord.html)

```tsx
(option?: StopRecordOption) => void
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
      <td>option</td>
      <td><code>StopRecordOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.stopRecord | ✔️ |  | ✔️ |

### takePhoto

Takes a photo.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/camera/CameraContext.takePhoto.html)

```tsx
(option: TakePhotoOption) => void
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
      <td>option</td>
      <td><code>TakePhotoOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.takePhoto | ✔️ |  | ✔️ |

### onCameraFrame

Gets the Camera real-time frame data.

**Note: To use this API, you must specify frame-size in the `camera` component property.**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/camera/CameraContext.onCameraFrame.html)

```tsx
(callback: OnCameraFrameCallback) => CameraFrameListener
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
      <td><code>OnCameraFrameCallback</code></td>
      <td>Callback function</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const context = wx.createCameraContext()
const listener = context.onCameraFrame((frame) => {
  console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
})
listener.start()
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.onCameraFrame | ✔️ |  |  |

## Parameters

### StartRecordOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>timeoutCallback</td>
      <td><code>StartRecordTimeoutCallback</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Video recording will end after 30 sec or the page is <code>onHide</code>.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### StartRecordTimeoutCallback

Video recording will end after 30 sec or the page is `onHide`.

```tsx
(result: StartRecordTimeoutCallbackResult) => void
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
      <td><code>StartRecordTimeoutCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### StartRecordTimeoutCallbackResult

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
      <td>tempThumbPath</td>
      <td><code>string</code></td>
      <td>The temporary path to cover images files</td>
    </tr>
    <tr>
      <td>tempVideoPath</td>
      <td><code>string</code></td>
      <td>The temporary path to video files</td>
    </tr>
  </tbody>
</table>

### StopRecordOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### StopRecordSuccessCallbackResult

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
      <td>tempThumbPath</td>
      <td><code>string</code></td>
      <td>The temporary path to cover images files</td>
    </tr>
    <tr>
      <td>tempVideoPath</td>
      <td><code>string</code></td>
      <td>The temporary path to video files</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### TakePhotoOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>quality</td>
      <td><code>&quot;high&quot; | &quot;normal&quot; | &quot;low&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Image quality</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### TakePhotoSuccessCallbackResult

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
      <td>tempImagePath</td>
      <td><code>string</code></td>
      <td>The temporary path to photo files (jpg for Android and png for iOS).</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### OnCameraFrameCallback

Callback function

```tsx
(result: OnCameraFrameCallbackResult) => void
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
      <td><code>OnCameraFrameCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnCameraFrameCallbackResult

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
      <td>data</td>
      <td><code>ArrayBuffer</code></td>
      <td>The image pixel data, which is a one-dimensional array in which every four items express the RGBA color of one pixel.</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>The height of the image data rectangle</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>The width of the image data rectangle</td>
    </tr>
  </tbody>
</table>

### quality

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>high</td>
      <td>High quality</td>
    </tr>
    <tr>
      <td>normal</td>
      <td>Normal quality</td>
    </tr>
    <tr>
      <td>low</td>
      <td>Low quality</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraContext.startRecord | ✔️ |  | ✔️ |
| CameraContext.stopRecord | ✔️ |  | ✔️ |
| CameraContext.takePhoto | ✔️ |  | ✔️ |
| CameraContext.onCameraFrame | ✔️ |  |  |
