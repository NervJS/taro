---
title: Taro.downloadFile(param)
sidebar_label: downloadFile
---

下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径。使用前请注意阅读相关说明。

注意：请在服务端响应的 header 中指定合理的 Content-Type 字段，以保证客户端正确处理文件类型。

使用方式同 [`wx.downloadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.downloadFile.html)，支持 `Promise` 化使用。

## 参数

### object param

| Property | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | 下载资源的 url |
| [header] | <code>object</code> | HTTP 请求的 Header，Header 中不能设置 Referer |
| [filePath] | <code>string</code> | 指定文件下载后存储的路径(h5端该参数无效) |
| [success()] | <code>function</code> | 接口调用成功的回调函数 |
| [fail()] | <code>function</code> | 接口调用失败的回调函数 |
| [complete()] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 返回值

### Promise&lt;object res&gt; promise

| Name | Type | Description |
| --- | --- | --- |
| promise.headersReceive(callback) | <code>function</code> | 绑定接收到http header的回调 |
| promise.progress(callback) | <code>function</code> | 绑定请求进度更新的回调 |
| promise.abort() | <code>function</code> | 中断请求 |
| res.statusCode | <code>number</code> | 请求的返回状态码 |
| res.tempFilePath | <code>string</code> | 下载文件的临时路径 |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.downloadFile(params).then(...)
```


## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.downloadFile | ✔️ | ✔️ | ️ | ✔️ | ✔️ |

