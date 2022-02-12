---
title: Taro.onVoIPChatStateChanged(callback)
sidebar_label: onVoIPChatStateChanged
---

监听房间状态变化事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.onVoIPChatStateChanged.html)

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
| code | `number` | 事件码 |
| data | `Record<any, any>` | 附加信息 |
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
