---
title: Camera
sidebar_label: Camera
---

System camera.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/camera.html)

## Type

```tsx
ComponentType<CameraProps>
```

## CameraProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mode</td>
      <td><code>&quot;normal&quot; | &quot;scanCode&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;normal&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Application mode. It is valid only during initialization, and cannot be dynamically changed.</td>
    </tr>
    <tr>
      <td>resolution</td>
      <td><code>&quot;low&quot; | &quot;medium&quot; | &quot;high&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;medium&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Resolution, no dynamic changes supported.</td>
    </tr>
    <tr>
      <td>devicePosition</td>
      <td><code>&quot;front&quot; | &quot;back&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;back&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The facing orientation of the camera.</td>
    </tr>
    <tr>
      <td>flash</td>
      <td><code>&quot;auto&quot; | &quot;on&quot; | &quot;off&quot; | &quot;torch&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;auto&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The flash. Values include auto, on, and off.</td>
    </tr>
    <tr>
      <td>frameSize</td>
      <td><code>&quot;medium&quot; | &quot;small&quot; | &quot;large&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;medium&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the expected size of camera frame data</td>
    </tr>
    <tr>
      <td>scanArea</td>
      <td><code>number[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Scan to identify area, result is [x, y, w, h],<br />is the upper left corner of the display area relative to the camera.<br />w,h is the area size in px. It is valid only when only mode=&quot;scanCode&quot;</td>
    </tr>
    <tr>
      <td>onStop</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the camera is closed unexpectedly, for example, exiting the background.</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the camera is not authorized.</td>
    </tr>
    <tr>
      <td>onInitDone</td>
      <td><code>BaseEventOrigFunction&lt;onInitDoneEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered after the camera is initialized</td>
    </tr>
    <tr>
      <td>onScanCode</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when a scanned QR code is recognized. <br />It is valid only when mode=&quot;scanCode&quot;.</td>
    </tr>
  </tbody>
</table>

### Property Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraProps.mode | ✔️ |  | ✔️ |
| CameraProps.resolution | ✔️ |  |  |
| CameraProps.devicePosition | ✔️ |  | ✔️ |
| CameraProps.flash | ✔️ |  | ✔️ |
| CameraProps.frameSize | ✔️ |  |  |
| CameraProps.scanArea | ✔️ |  |  |
| CameraProps.onStop | ✔️ |  | ✔️ |
| CameraProps.onError | ✔️ |  | ✔️ |
| CameraProps.onInitDone | ✔️ |  | ✔️ |
| CameraProps.onScanCode | ✔️ |  | ✔️ |

### mode

Valid values of mode

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>normal</td>
      <td>Camera mode</td>
    </tr>
    <tr>
      <td>scanCode</td>
      <td>Scanning mode</td>
    </tr>
  </tbody>
</table>

### resolution

Valid values of resolution

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>low</td>
      <td>low</td>
    </tr>
    <tr>
      <td>medium</td>
      <td>medium</td>
    </tr>
    <tr>
      <td>high</td>
      <td>high</td>
    </tr>
  </tbody>
</table>

### devicePosition

Valid values of device-position

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>front</td>
      <td>Front-facing camera</td>
    </tr>
    <tr>
      <td>back</td>
      <td>Rear-facing camera</td>
    </tr>
  </tbody>
</table>

### flash

Valid values of flash

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>auto</td>
      <td>Auto</td>
    </tr>
    <tr>
      <td>on</td>
      <td>On</td>
    </tr>
    <tr>
      <td>off</td>
      <td>Off</td>
    </tr>
    <tr>
      <td>torch</td>
      <td>Always bright</td>
    </tr>
  </tbody>
</table>

### frameSize

Valid values of frame-size

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>small</td>
      <td>Small-size frame data</td>
    </tr>
    <tr>
      <td>medium</td>
      <td>Medium-size frame data</td>
    </tr>
    <tr>
      <td>large</td>
      <td>Large-size frame data</td>
    </tr>
  </tbody>
</table>

### onInitDoneEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>maxZoom</td>
      <td><code>number</code></td>
      <td>Maximum zoom</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Camera | ✔️ |  | ✔️ |
