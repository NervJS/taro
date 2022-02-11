---
title: Taro.requestSubscribeDeviceMessage(option)
sidebar_label: requestSubscribeDeviceMessage
---

订阅设备消息接口，调用后弹出授权框，用户同意后会允许开发者给用户发送订阅模版消息。当用户点击“允许”按钮时，模板消息会被添加到用户的小程序设置页，通过 wx.getSetting 接口可获取用户对相关模板消息的订阅状态。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeDeviceMessage.html)

## 类型

```tsx
(option: Option) => Promise<FailCallbackResult | SuccessCallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| tmplIds | `string[]` | 是 | 需要订阅的消息模板的 id 的集合，一次调用最多可订阅3条消息 |
| sn | `string` | 是 | 设备唯一序列号。由厂商分配，长度不能超过128字节。字符只接受数字，大小写字母，下划线（_）和连字符（-）。 |
| snTicket | `string` | 是 | 设备票据，5分钟内有效。 |
| modelId | `string` | 是 | 设备型号 id 。通过微信公众平台注册设备获得。 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errCode | `number` | 接口调用失败错误码，有可能为空 |
| errMsg | `string` | 接口调用失败错误信息 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| [TEMPLATE_ID] | "accept" or "reject" or "ban" or "filter" or "acceptWithAudio" | [TEMPLATE_ID]是动态的键，即模板id |
| errMsg | `string` | 接口调用成功时errMsg值为'requestSubscribeMessage:ok' |

#### 示例代码

表示用户同意订阅 zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE 这条消息
```json
{
  "errMsg": "requestSubscribeDeviceMessage:ok",
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
| filter | 表示该模板因为模板标题同名被后台过滤 |
| acceptWithAudio | 表示用户接收订阅消息并开启了语音提醒 |

## 示例代码

```tsx
Taro.requestSubscribeDeviceMessage({
  tmplIds: ['xxxxx'],
  sn: 'xxxx',
  snTicket: 'xxxxx',
  modelId: 'xxx',
  success(res) {
    console.log(res)
  },
  fail(res) {
    console.log(res)
  }
})
```
