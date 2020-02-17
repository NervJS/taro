---
title: Taro.requestSubscribeMessage(option)
sidebar_label: requestSubscribeMessage
---

请求订阅消息

注意：[2.8.2](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 版本开始，用户发生点击行为或者发起支付回调后，才可以调起订阅消息界面。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult | FailCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| tmplIds | `any[]` | 是 | 需要订阅的消息模板的id的集合（注意：iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次性订阅/长期订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息）消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errCode | `number` | 接口调用失败错误码 |
| errMsg | `string` | 接口调用失败错误信息 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| [TEMPLATE_ID] | "accept" or "reject" or "ban" | 动态的键，即模板id |
| errMsg | `string` | 接口调用成功时errMsg值为'requestSubscribeMessage:ok' |

#### 示例代码

表示用户同意订阅 zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE 这条消息

```json
{
  "errMsg": "requestSubscribeMessage:ok",
  "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
}
```

### template_reflex

模版消息订阅类型

| 参数 | 说明 |
| --- | --- |
| accept | 表示用户同意订阅该条id对应的模板消息 |
| reject | 表示用户拒绝订阅该条id对应的模板消息 |
| ban | 表示已被后台封禁 |

## 示例代码

```tsx
Taro.requestSubscribeMessage({
  tmplIds: [''],
  success: function (res) { }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.requestSubscribeMessage | ✔️ |  |  |
