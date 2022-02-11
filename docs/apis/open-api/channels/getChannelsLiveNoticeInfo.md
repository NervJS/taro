---
title: Taro.getChannelsLiveNoticeInfo(option)
sidebar_label: getChannelsLiveNoticeInfo
---

获取视频号直播预告信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/channels/wx.getChannelsLiveNoticeInfo.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| finderUserName | `string` | 是 | 视频号 id，以“sph”开头的id，可在视频号助手获取 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| nonceId | `string` | 预告 nonceId |
| status | `number` | 预告状态：0可用 1取消 2已用 |
| startTime | `string` | 开始时间 |
| headUrl | `string` | 直播封面 |
| nickname | `string` | 视频号昵称 |
| reservable | `boolean` | 是否可预约 |

### Status

| 参数 | 说明 |
| --- | --- |
| 0 | 可用 |
| 1 | 取消 |
| 2 | 已用 |
