---
title: Taro.openDocument(option)
sidebar_label: openDocument
---

Opens a file in a new page.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/wx.openDocument.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>File path, which can be obtained via downloadFile</td>
    </tr>
    <tr>
      <td>fileType</td>
      <td><code>&quot;doc&quot; | &quot;docx&quot; | &quot;xls&quot; | &quot;xlsx&quot; | &quot;ppt&quot; | &quot;pptx&quot; | &quot;pdf&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>File type in which the file is opened</td>
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

### fileType

Valid values of object.fileType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>doc</td>
      <td>doc format</td>
    </tr>
    <tr>
      <td>docx</td>
      <td>docx format</td>
    </tr>
    <tr>
      <td>xls</td>
      <td>xls format</td>
    </tr>
    <tr>
      <td>xlsx</td>
      <td>xlsx format</td>
    </tr>
    <tr>
      <td>ppt</td>
      <td>ppt format</td>
    </tr>
    <tr>
      <td>pptx</td>
      <td>pptx format</td>
    </tr>
    <tr>
      <td>pdf</td>
      <td>pdf format</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.downloadFile({
  url: 'https://example.com/somefile.pdf',
  success: function (res) {
    var filePath = res.tempFilePath
    Taro.openDocument({
      filePath: filePath,
      success: function (res) {
        console.log('File opened successfully')
      }
    })
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openDocument | ✔️ |  |  |
