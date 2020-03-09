---
title: Taro.openDocument(option)
sidebar_label: openDocument
id: version-1.3.38-openDocument
original_id: openDocument
---

新开页面打开文档，支持格式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.openDocument.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 文件路径，可通过 downloadFile 获得 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| fileType | "doc" or "docx" or "xls" or "xlsx" or "ppt" or "pptx" or "pdf" | 否 | 文件类型，指定文件类型打开文件 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### fileType

文件类型

| 参数 | 说明 |
| --- | --- |
| doc | doc 格式 |
| docx | docx 格式 |
| xls | xls 格式 |
| xlsx | xlsx 格式 |
| ppt | ppt 格式 |
| pptx | pptx 格式 |
| pdf | pdf 格式 |

## 示例代码

```tsx
Taro.downloadFile({
  url: 'http://example.com/somefile.pdf',
  success: function (res) {
    var filePath = res.tempFilePath
    Taro.openDocument({
      filePath: filePath,
      success: function (res) {
        console.log('打开文档成功')
      }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openDocument | ✔️ |  |  |
