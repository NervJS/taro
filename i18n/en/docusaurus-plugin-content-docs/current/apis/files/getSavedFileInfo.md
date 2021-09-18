---
title: Taro.getSavedFileInfo(option)
sidebar_label: getSavedFileInfo
---

Gets the information of local files. This API can only be used to obtain the information of files that have been saved to the local device. To obtain information of temporary files, use `Taro.getFileInfo()` API.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/wx.getSavedFileInfo.html)

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
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>File path</td>
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
      <td>createTime</td>
      <td><code>number</code></td>
      <td>The timestamp when the file was saved, which is defined as the number of seconds that have elapsed since 1970/01/01 08:00:00 to the current time</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>File size in bytes</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getSavedFileInfo({
  filePath: 'wxfile://somefile',
  success: function (res) {
    console.log(res.size)
    console.log(res.createTime)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSavedFileInfo | ✔️ |  | ✔️ |
