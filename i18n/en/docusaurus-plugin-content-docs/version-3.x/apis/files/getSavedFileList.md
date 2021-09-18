---
title: Taro.getSavedFileList(option)
sidebar_label: getSavedFileList
---

Gets the list of local cache files saved under the Mini Program.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/wx.getSavedFileList.html)

## Type

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
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
      <td>fileList</td>
      <td><code>FileItem[]</code></td>
      <td>File array, with each item being a FileItem</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### FileItem

res.fileList is composed as follows

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
      <td>createTime</td>
      <td><code>number</code></td>
      <td>The timestamp when the file was saved, which is defined as the number of seconds that have elapsed since 1970/01/01 08:00:00 to the current time</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>Local path</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>Local file size in bytes</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getSavedFileList({
  success: function (res) {
    console.log(res.fileList)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSavedFileList | ✔️ |  | ✔️ |
