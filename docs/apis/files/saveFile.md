---
title: Taro.saveFile(option)
sidebar_label: saveFile
---

保存文件到本地。**注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.saveFile.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult | FailCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| tempFilePath | `string` | 是 | 临时存储文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| filePath | `string` | 否 | 要存储的文件路径 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail tempFilePath file not exist': 指定的 tempFilePath 找不到文件;<br />- 'fail permission denied, open "${filePath}"': 指定的 filePath 路径没有写权限;<br />- 'fail no such file or directory "${dirPath}"': 上级目录不存在;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| savedFilePath | `number` | 存储后的文件路径 |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
Taro.chooseImage({
  success: function (res) {
    var tempFilePaths = res.tempFilePaths
    Taro.saveFile({
      tempFilePath: tempFilePaths[0],
      success: function (res) {
        var savedFilePath = res.savedFilePath
      }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.saveFile | ✔️ |  |  |
