---
title: Taro.getFileInfo(option)
sidebar_label: getFileInfo
---

获取该小程序下的 本地临时文件 或 本地缓存文件 信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html)

## 类型

```tsx
(option: Option) => Promise<FailCallbackResult | SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| filePath | `string` |  | 是 | 要读取的文件路径 |
| digestAlgorithm | "md5" or "sha1" | `'md5'` | 否 | 计算文件摘要的算法 |
| complete | `(res: TaroGeneral.CallbackResult) => void` |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` |  | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` |  | 否 | 接口调用成功的回调函数 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 filePath 找不到文件; |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| size | `number` | 文件大小，以字节为单位 |
| digest | `string` | 按照传入的 digestAlgorithm 计算得出的的文件摘要 |
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
