---
title: Taro.getFileInfo(option)
sidebar_label: getFileInfo
id: version-1.3.37-getFileInfo
original_id: getFileInfo
---

获取该小程序下的 本地临时文件 或 本地缓存文件 信息

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult | FailCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要读取的文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 filePath 找不到文件; |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| size | `number` | 文件大小，以字节为单位 |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
Taro.getFileInfo({
    success: function (res) {
        console.log(res.size)
        console.log(res.digest)
    }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getFileInfo | ✔️ |  |  |
