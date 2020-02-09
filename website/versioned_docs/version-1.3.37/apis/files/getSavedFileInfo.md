---
title: Taro.getSavedFileInfo(option)
sidebar_label: getSavedFileInfo
id: version-1.3.37-getSavedFileInfo
original_id: getSavedFileInfo
---

获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 [Taro.getFileInfo](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html) 接口。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileInfo.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| createTime | `number` | 文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数 |
| size | `number` | 文件大小，单位 B |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
Taro.getSavedFileInfo({
  filePath: 'wxfile://somefile', //仅做示例用，非真正的文件路径
  success: function (res) {
    console.log(res.size)
    console.log(res.createTime)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSavedFileInfo | ✔️ |  |  |
