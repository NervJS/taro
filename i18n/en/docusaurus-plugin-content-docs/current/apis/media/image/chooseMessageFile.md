---
title: Taro.chooseMessageFile(option)
sidebar_label: chooseMessageFile
---

Selects a file from a client session.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/image/wx.chooseMessageFile.html)

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
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The maximum number of files that can be selected. 0-100 is allowed</td>
    </tr>
    <tr>
      <td>extension</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Filtered by the file extension name. It takes effect only when type==file. The strings within it cannot be empty. Filtering is not performed by default.</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;all&quot; | &quot;video&quot; | &quot;image&quot; | &quot;file&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The selected file type</td>
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
      <td><code>ChooseFile[]</code></td>
      <td>Returns an array of local temporary file objects for the selected files</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### ChooseFile

res.tempFiles is composed as follows

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
      <td>name</td>
      <td><code>string</code></td>
      <td>The selected file name</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>The path to the local temporary file</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>The size of a local temporary file, in bytes</td>
    </tr>
    <tr>
      <td>time</td>
      <td><code>number</code></td>
      <td>Time when the session of the selected file is sent. It is a Unix timestamp and not supported in WeChat DevTools.</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;video&quot; | &quot;image&quot; | &quot;file&quot;</code></td>
      <td>The selected file type</td>
    </tr>
  </tbody>
</table>

### selectType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>all</td>
      <td>All the files can be selected.</td>
    </tr>
    <tr>
      <td>video</td>
      <td>Only video files can be selected.</td>
    </tr>
    <tr>
      <td>image</td>
      <td>Only image files can be selected.</td>
    </tr>
    <tr>
      <td>file</td>
      <td>Files except images and videos can be selected.</td>
    </tr>
  </tbody>
</table>

### selectedType

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
      <td>A video file is selected.</td>
    </tr>
    <tr>
      <td>image</td>
      <td>An image file is selected.</td>
    </tr>
    <tr>
      <td>file</td>
      <td>A file except images and videos is selected.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.chooseMessageFile({
  count: 10,
  type: 'image',
  success: function (res) {
    // tempFilePath can be used as the src property of the img tag to display images.
    const tempFilePaths = res.tempFilePaths
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseMessageFile | ✔️ |  |  |
