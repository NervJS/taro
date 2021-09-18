---
title: Taro.saveVideoToPhotosAlbum(option)
sidebar_label: saveVideoToPhotosAlbum
---

Saves videos to system album. The MP4 format is supported. [User Authorization](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/authorize.html) is required for scope.writePhotosAlbum before this API is called.

**Bug & Tip：**

1.  `tip`: The camera parameter does not work on some Android phones because the system ROM does not support it.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/wx.saveVideoToPhotosAlbum.html)

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
      <td>Video file path, which can be a temporary file path or a permanent file path.</td>
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

## Sample Code

```tsx
Taro.saveVideoToPhotosAlbum({
  filePath: 'wxfile://xxx'
  success: function (res) {
    console.log(res.errMsg)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.saveVideoToPhotosAlbum | ✔️ |  | ✔️ |
