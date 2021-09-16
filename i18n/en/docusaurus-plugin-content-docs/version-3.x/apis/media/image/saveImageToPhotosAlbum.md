---
title: Taro.saveImageToPhotosAlbum(option)
sidebar_label: saveImageToPhotosAlbum
---

Saves images to the system album. [User Authorization](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/authorize.html) is required for scope.writePhotosAlbum before this API is called.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/image/wx.saveImageToPhotosAlbum.html)

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
      <td>The path to the image file. It can be a temporary or permanent file path. The path to a network image is not supported.</td>
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
Taro.saveImageToPhotosAlbum({
  success: function (res) { }
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.saveImageToPhotosAlbum | ✔️ | ✔️ | ✔️ |  | ✔️ |
