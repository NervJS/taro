---
title: Taro.uploadFile(option)
sidebar_label: uploadFile
---

Uploads local resources to the server. The client initiates an HTTPS POST request with `content-type` being `multipart/form-data`. Read [related instructions](https://developers.weixin.qq.com/miniprogram/en/dev/framework/ability/network.html) before use.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/upload/wx.uploadFile.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult & UploadTask> & UploadTask
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
      <td>url</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Developer server URL</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to upload a file</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Key of the file. The developer can get the binary content of the file on the server via this key.</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>HTTP request Header. Referer is not available in Header.</td>
    </tr>
    <tr>
      <td>formData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Additional form data in the HTTP request</td>
    </tr>
    <tr>
      <td>timeout</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Timeout time, in ms</td>
    </tr>
    <tr>
      <td>fileName</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Name of the uploaded file<br />(Only H5)</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Option.fileName |  | ✔️ |  |

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
      <td>data</td>
      <td><code>string</code></td>
      <td>Data returned by the developer server</td>
    </tr>
    <tr>
      <td>statusCode</td>
      <td><code>number</code></td>
      <td>HTTP status code returned by the developer server</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

## Sample Code

### Example 1

```tsx
Taro.chooseImage({
  success (res) {
    const tempFilePaths = res.tempFilePaths
    Taro.uploadFile({
      url: 'https://example.weixin.qq.com/upload', //This value for demonstration purposes only is not a real API URL.
      filePath: tempFilePaths[0],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success (res){
        const data = res.data
        //do something
      }
    })
  }
})
```

### Example 2

```tsx
const uploadTask = Taro.uploadFile({
  url: 'https://example.weixin.qq.com/upload', //This value for demonstration purposes only is not a real API URL.
  filePath: tempFilePaths[0],
  name: 'file',
  formData:{
    'user': 'test'
  },
  success: function (res){
    var data = res.data
    //do something
  }
})
uploadTask.onProgressUpdate((res) => {
  console.log('Upload progress', res.progress)
  console.log('The length of uploaded data', res.totalBytesSent)
  console.log('The length of data expected to be uploaded', res.totalBytesExpectedToSend)
})

uploadTask.abort() // Cancel upload tasks
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.uploadFile | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
