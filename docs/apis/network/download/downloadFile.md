---
title: Taro.downloadFile(option)
sidebar_label: downloadFile
---

下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径，单次下载允许的最大文件为 50MB。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。

注意：请在服务端响应的 header 中指定合理的 `Content-Type` 字段，以保证客户端正确处理文件类型。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html)

## 类型

```tsx
(option: Option) => DownloadTask
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>url</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>下载资源的 url</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>指定文件下载后存储的路径</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>HTTP 请求的 Header，Header 中不能设置 Referer</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: FileSuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### FileSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>用户文件路径。传入 filePath 时会返回，跟传入的 filePath 一致</td>
    </tr>
    <tr>
      <td>statusCode</td>
      <td><code>number</code></td>
      <td>开发者服务器返回的 HTTP 状态码</td>
    </tr>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>临时文件路径。没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.downloadFile({
  url: 'https://example.com/audio/123', //仅为示例，并非真实的资源
  success: function (res) {
    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    if (res.statusCode === 200) {
      Taro.playVoice({
        filePath: res.tempFilePath
      })
    }
  }
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.downloadFile | ✔️ | ✔️ | ✔️ | ✔️ |  |
