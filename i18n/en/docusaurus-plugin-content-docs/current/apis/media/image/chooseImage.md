---
title: Taro.chooseImage(option)
sidebar_label: chooseImage
---

Selects an image from the local album or takes a photo with the camera.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/image/wx.chooseImage.html)

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
      <td>The maximum number of images allowed</td>
    </tr>
    <tr>
      <td>sizeType</td>
      <td><code>(&quot;original&quot; | &quot;compressed&quot;)[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The size of the select image</td>
    </tr>
    <tr>
      <td>sourceType</td>
      <td><code>(&quot;album&quot; | &quot;camera&quot; | &quot;user&quot; | &quot;environment&quot;)[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The source of the image</td>
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

### sizeType

Valid values of object.sizeType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>original</td>
      <td>Original image</td>
    </tr>
    <tr>
      <td>compressed</td>
      <td>compressed</td>
    </tr>
  </tbody>
</table>

### sourceType

Valid values of object.sourceType

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
      <td>Selects an image from the album</td>
    </tr>
    <tr>
      <td>camera</td>
      <td>Takes a photo with the camera</td>
    </tr>
    <tr>
      <td>user</td>
      <td>Using the front camera (Only H5)</td>
    </tr>
    <tr>
      <td>environment</td>
      <td>Using the rear camera (Only H5)</td>
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
      <td>tempFilePaths</td>
      <td><code>string[]</code></td>
      <td>The list of local temporary file paths to images</td>
    </tr>
    <tr>
      <td>tempFiles</td>
      <td><code>ImageFile[]</code></td>
      <td>The local temporary file list for images</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### ImageFile

List of local temporary files for images

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
      <td>path</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The path to the local temporary file</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The size of a local temporary file, in bytes</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The MIME type of the file.<br />(Only H5)</td>
    </tr>
    <tr>
      <td>originalFileObj</td>
      <td><code>File</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The original browser File object.<br />(Only H5)</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| ImageFile.type |  | ✔️ |  |
| ImageFile.originalFileObj |  | ✔️ |  |

## Sample Code

```tsx
Taro.chooseImage({
  count: 1, // The default value is 9
  sizeType: ['original', 'compressed'], // You can specify whether the image is original or compressed, both are available by default.
  sourceType: ['album', 'camera'], // You can specify whether the source is an album or a camera, both are available by default.
  success: function (res) {
    // tempFilePath can be used as the src property of the img tag to display images.
    var tempFilePaths = res.tempFilePaths
  }
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.chooseImage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
