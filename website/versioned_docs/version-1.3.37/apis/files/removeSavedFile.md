---
title: Taro.removeSavedFile(option)
sidebar_label: removeSavedFile
id: version-1.3.37-removeSavedFile
original_id: removeSavedFile
---

删除该小程序下已保存的本地缓存文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.removeSavedFile.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 需要删除的文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RemoveSavedFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 tempFilePath 找不到文件; |

## 示例代码

```tsx
Taro.getSavedFileList({
  success: function (res) {
    if (res.fileList.length > 0){
      Taro.removeSavedFile({
        filePath: res.fileList[0].filePath,
        complete: function (res) {
          console.log(res)
        }
      })
    }
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.removeSavedFile | ✔️ |  |  |
