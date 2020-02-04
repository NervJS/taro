---
title: Taro.getSavedFileList(option)
sidebar_label: getSavedFileList
---

获取本地已保存的文件列表

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileList.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fileList | `FileItem[]` | 文件数组 |
| errMsg | `string` | 调用结果 |

### FileItem

文件数组

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| createTime | `number` | 文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数 |
| filePath | `string` | 本地路径 |
| size | `number` | 本地文件大小，以字节为单位 |

## 示例代码

```tsx
Taro.getSavedFileList({
  success: function (res) {
    console.log(res.fileList)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSavedFileList | ✔️ |  |  |
