---
title: Taro.onUnhandledRejection(callback)
sidebar_label: onUnhandledRejection
---

监听未处理的 Promise 拒绝事件。该事件与 [`App.onUnhandledRejection`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onUnhandledRejection-Object-object) 的回调时机与参数一致。

**注意**
- 所有的 unhandledRejection 都可以被这一监听捕获，但只有 Error 类型的才会在小程序后台触发报警。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onUnhandledRejection.html)

## 类型

```tsx
<T = any>(callback: Callback<T>) => void
```

## 参数

| 参数 | 类型 |
| --- | --- |
| callback | `T` |

### Callback

```tsx
(res: Result<T>) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `Result<T>` |

### Result

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| reason | string or Error | 拒绝原因，一般是一个 Error 对象 |
| promise | `Promise<T>` | 被拒绝的 Promise 对象 |
