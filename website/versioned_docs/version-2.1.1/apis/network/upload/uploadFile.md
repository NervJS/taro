---
title: Taro.uploadFile(option)
sidebar_label: uploadFile
id: version-2.1.1-uploadFile
original_id: uploadFile
---

将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 `content-type` 为 `multipart/form-data`。使用前请注意阅读[相关说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult & UploadTask> & UploadTask
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
      <td>开发者服务器地址</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要上传文件资源的路径</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容</td>
    </tr>
    <tr>
      <td>header</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>HTTP 请求 Header，Header 中不能设置 Referer</td>
    </tr>
    <tr>
      <td>formData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>HTTP 请求中其他额外的 form data</td>
    </tr>
    <tr>
      <td>timeout</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>超时时间，单位为毫秒</td>
    </tr>
    <tr>
      <td>fileName</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>上传的文件名<br />API 支持度: h5</td>
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
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Option.fileName |  | ✔️ |  |

### SuccessCallbackResult

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
      <td>data</td>
      <td><code>string</code></td>
      <td>开发者服务器返回的数据</td>
    </tr>
    <tr>
      <td>statusCode</td>
      <td><code>number</code></td>
      <td>开发者服务器返回的 HTTP 状态码</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

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
