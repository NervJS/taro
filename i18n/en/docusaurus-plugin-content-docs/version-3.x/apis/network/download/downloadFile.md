---
title: Taro.downloadFile(option)
sidebar_label: downloadFile
---

Downloads local resources to the local device. The client initiates an HTTPS GET request. The local temporary path to the file is returned. The maximum file size for a single download is 50 MB. Read [related instructions](https://developers.weixin.qq.com/miniprogram/en/dev/framework/ability/network.html) before use.

**Note:** Specify a reasonable `Content-Type` field in the server response header to ensure that the client handles the file type properly.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/download/wx.downloadFile.html)

## Type

```tsx
(option: Option) => DownloadTask
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
      <td>URL to download resources</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates the path to save downloaded files</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>HTTP request Header. Referer is not available in Header.</td>
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

### FileSuccessCallbackResult

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
      <td>filePath</td>
      <td><code>string</code></td>
      <td>User file path. It is returned when the filePath is specified. Same as the passed filePath.</td>
    </tr>
    <tr>
      <td>statusCode</td>
      <td><code>number</code></td>
      <td>HTTP status code returned by the developer server</td>
    </tr>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>Temporary file path. It is returned when the filePath to save files is not specified. The downloaded files will be stored in a temporary file path.</td>
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
Taro.downloadFile({
  url: 'https://example.com/audio/123', //This value for demonstration purposes only is not a real resource.
  success: function (res) {
    // As long as there is response data in the server, the response content will be written to the file and the success callback is triggered. Judge whether desired data is downloaded depending on the service.
    if (res.statusCode === 200) {
      Taro.playVoice({
        filePath: res.tempFilePath
      })
    }
  }
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-MiniProgram | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.downloadFile | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
