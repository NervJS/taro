---
title: Taro.getLaunchOptionsSync()
sidebar_label: getLaunchOptionsSync
---

获取小程序启动时的参数。与 [`App.onLaunch`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onlaunchobject-object) 的回调参数一致。

**注意**
部分版本在无`referrerInfo`的时候会返回 `undefined`，建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html)

## 类型

```tsx
() => LaunchOptionsApp
```

## 参数

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getLaunchOptionsSync | ✔️ |  |  |
