---
title: Taro.onVoIPChatSpeakersChanged(callback)
sidebar_label: onVoIPChatSpeakersChanged
---

监听实时语音通话成员通话状态变化事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.onVoIPChatSpeakersChanged.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

| 参数 | 类型 |
| --- | --- |
| callback | `Callback` |

### Result

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| openIdList | `string[]` | 还在实时语音通话中的成员 openId 名单 |
| errCode | `number` | 错误码 |
| errMsg | `string` | 调用结果 |

### Callback

房间状态变化事件的回调函数

```tsx
(res: Result) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `Result` |
