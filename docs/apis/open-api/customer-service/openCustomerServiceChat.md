---
title: Taro.openCustomerServiceChat(option)
sidebar_label: openCustomerServiceChat
---

打开微信客服。了解更多信息，可以参考微信客服介绍：https://work.weixin.qq.com/kf/。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/service-chat/wx.openCustomerServiceChat.html)

## 类型

```tsx
(option?: Option) => Promise<TaroGeneral.CallbackResult>
```

## 参数

### ExtInfo

| 参数 | 类型 |
| --- | --- |
| url | `string` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| extInfo | `ExtInfo` | 是 | 客服信息 |
| corpId | `string` | 是 | 企业ID |
| showMessageCard | `boolean` | 否 | 是否发送小程序气泡消息，默认值：false |
| sendMessageTitle | `string` | 否 | 气泡消息标题 |
| sendMessagePath | `string` | 否 | 气泡消息小程序路径 |
| sendMessageImg | `string` | 否 | 气泡消息图片 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.openCustomerServiceChat({
  extInfo: {url: ''},
  corpId: '',
  success: function (res) { }
})
```
