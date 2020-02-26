---
title: Taro.getShareInfo(option)
sidebar_label: getShareInfo
---

获取转发详细信息

**Tips**
- 如需要展示群名称，可以使用[开放数据组件](https://developers.weixin.qq.com/miniprogram/dev/component/open-ability/open-data.html)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| shareTicket | `string` | 是 | shareTicket |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| timeout | `number` | 否 | 超时时间，单位 ms |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| cloudID | `string` | 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) |
| encryptedData | `string` | 包括敏感数据在内的完整转发信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) |
| errMsg | `string` | 错误信息 |
| iv | `string` | 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) |

## 示例代码

敏感数据有两种获取方式，一是使用 [加密数据解密算法]((open-ability/signature#加密数据解密算法)) 。
获取得到的开放数据为以下 json 结构（其中 openGId 为当前群的唯一标识）：
```json
{
 "openGId": "OPENGID"
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getShareInfo | ✔️ |  |  |
