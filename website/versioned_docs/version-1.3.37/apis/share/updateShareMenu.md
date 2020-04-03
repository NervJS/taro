---
title: Taro.updateShareMenu(option)
sidebar_label: updateShareMenu
id: version-1.3.37-updateShareMenu
original_id: updateShareMenu
---

更新转发属性

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.updateShareMenu.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| activityId | `string` | 否 | 动态消息的 activityId。通过 [updatableMessage.createActivityId](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/updatable-message/updatableMessage.createActivityId.html) 接口获取 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| isUpdatableMessage | `boolean` | 否 | 是否是动态消息，详见[动态消息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share/updatable-message.html) |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| templateInfo | `UpdatableMessageFrontEndTemplateInfo` | 否 | 动态消息的模板信息 |
| withShareTicket | `boolean` | 否 | 是否使用带 shareTicket 的转发[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) |

### UpdatableMessageFrontEndTemplateInfo

动态消息的模板信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| parameterList | `UpdatableMessageFrontEndParameter[]` | 参数列表 |

### UpdatableMessageFrontEndParameter

参数列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | `string` | 参数名 |
| value | `string` | 参数值 |

## 示例代码

```tsx
Taro.updateShareMenu({
  withShareTicket: true,
  success () { }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.updateShareMenu | ✔️ |  |  |
