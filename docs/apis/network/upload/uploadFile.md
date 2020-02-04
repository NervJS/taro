---
title: Taro.uploadFile(option)
sidebar_label: uploadFile
---

将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 `content-type` 为 `multipart/form-data`。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult & UploadTask> & UploadTask
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要上传文件资源的路径 |
| name | `string` | 是 | 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 |
| url | `string` | 是 | 开发者服务器地址 |
| fileName | `string` | 否 | 上传的文件名<br />API 支持度: h5 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| formData | `Record<string, any>` | 否 | HTTP 请求中其他额外的 form data |
| header | `Record<string, any>` | 否 | HTTP 请求 Header，Header 中不能设置 Referer |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Option.fileName |  | ✔️ |  |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `string` | 开发者服务器返回的数据 |
| statusCode | `number` | 开发者服务器返回的 HTTP 状态码 |
| errMsg | `string` | 调用结果 |

## 示例代码

### 示例 1

```tsx
Taro.chooseImage({
  success (res) {
    const tempFilePaths = res.tempFilePaths
    Taro.uploadFile({
      url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
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

### 示例 2

```tsx
const uploadTask = Taro.uploadFile({
  url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
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
uploadTask.progress((res) => {
  console.log('上传进度', res.progress)
  console.log('已经上传的数据长度', res.totalBytesSent)
  console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
})
uploadTask.abort() // 取消上传任务
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.uploadFile | ✔️ | ✔️ | ✔️ | ✔️ |  |
