---
title: Taro.chooseVideo(option)
sidebar_label: chooseVideo
---

Takes a video or selects a video from the mobile album.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/wx.chooseVideo.html)

## Type

```tsx
(option: Option) => Promise<void>
```

## Parameters

### Option

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
      <td>camera</td>
      <td><code>&quot;back&quot; | &quot;front&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates the default camera to be enabled. On some Android phones, the setting cannot take effect because it is not supported in ROM.</td>
    </tr>
    <tr>
      <td>compressed</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to compress the selected video file</td>
    </tr>
    <tr>
      <td>maxDuration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The maximum duration of a recorded video (in sec)</td>
    </tr>
    <tr>
      <td>sourceType</td>
      <td><code>(&quot;album&quot; | &quot;camera&quot;)[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The source of the video</td>
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

### SuccessCallbackResult

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
      <td>duration</td>
      <td><code>number</code></td>
      <td>Duration of the selected video</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>Returns the height of the selected video</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>Amount of data of the selected video</td>
    </tr>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>Temporary file path of the selected video</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>Returns the width of the selected video</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### camera

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>back</td>
      <td>Enables the rear camera by default</td>
    </tr>
    <tr>
      <td>front</td>
      <td>Enables the front camera by default</td>
    </tr>
  </tbody>
</table>

### sourceType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>album</td>
      <td>Selects a video from the album</td>
    </tr>
    <tr>
      <td>camera</td>
      <td>Takes a video with the camera</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.chooseVideo({
  sourceType: ['album','camera'],
  maxDuration: 60,
  camera: 'back',
  success: function (res) {
    console.log(res.tempFilePath)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseVideo | ✔️ |  | ✔️ |
