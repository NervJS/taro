---
title: Taro.downloadFile(option)
sidebar_label: downloadFile
id: version-1.3.37-downloadFile
original_id: downloadFile
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

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| url | `string` | 是 | 下载资源的 url |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| filePath | `string` | 否 | 指定文件下载后存储的路径 |
| header | `Record<string, any>` | 否 | HTTP 请求的 Header，Header 中不能设置 Referer |
| success | `(result: FileSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FileSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 用户文件路径。传入 filePath 时会返回，跟传入的 filePath 一致 |
| statusCode | `number` | 开发者服务器返回的 HTTP 状态码 |
| tempFilePath | `string` | 临时文件路径。没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件 |
| errMsg | `string` | 调用结果 |

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
