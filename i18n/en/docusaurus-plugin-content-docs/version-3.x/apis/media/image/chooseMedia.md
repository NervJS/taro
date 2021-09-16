---
title: Taro.chooseMedia(option)
sidebar_label: chooseMedia
---

Take or select a picture or video from user phone's album.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult>
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
      <td>count</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Maximum number of files that can be selected</td>
    </tr>
    <tr>
      <td>mediaType</td>
      <td><code>(&quot;video&quot; | &quot;image&quot;)[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Media type.</td>
    </tr>
    <tr>
      <td>sourceType</td>
      <td><code>(&quot;album&quot; | &quot;camera&quot;)[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sources of images and videos.</td>
    </tr>
    <tr>
      <td>maxDuration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Maximum recording time in seconds for video recording. The range of time is between 3s and 30s.</td>
    </tr>
    <tr>
      <td>sizeType</td>
      <td><code>(&quot;original&quot; | &quot;compressed&quot;)[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to compress the selected file. (Only <code>mediaType === &quot;image&quot;</code>)</td>
    </tr>
    <tr>
      <td>camera</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to use the front or rear camera. (Only <code>sourceType === &quot;camera&quot;</code>)</td>
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
      <td>tempFiles</td>
      <td><code>ChooseMedia[]</code></td>
      <td>Returns an array of local temporary file objects for the selected files</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td>media type. (&quot;video&quot; | &quot;image&quot;)</td>
    </tr>
  </tbody>
</table>

### ChooseMedia

List of local temporary files

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
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>Local temporary file path</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>The size of a local temporary file, in bytes</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>Duration of the video</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>Height of the video</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>Width of the video</td>
    </tr>
    <tr>
      <td>thumbTempFilePath</td>
      <td><code>string</code></td>
      <td>Temporary file path for video thumbnails</td>
    </tr>
  </tbody>
</table>

### mediaType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>video</td>
      <td>Only take videos or select videos from albums.</td>
    </tr>
    <tr>
      <td>image</td>
      <td>Only take pictures or select pictures from albums.</td>
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
      <td>Select from albums</td>
    </tr>
    <tr>
      <td>camera</td>
      <td>Shooting with a camera</td>
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
      <td>Using the rear camera</td>
    </tr>
    <tr>
      <td>front</td>
      <td>Using the front camera</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.chooseMedia({
  count: 9,
  mediaType: ['image','video'],
  sourceType: ['album', 'camera'],
  maxDuration: 30,
  camera: 'back',
  success: (res) => {
    console.log(res.tempFiles)
    console.log(res.type)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseMedia | ✔️ |  | ✔️ |
