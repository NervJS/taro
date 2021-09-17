---
title: Taro.getLaunchOptionsSync()
sidebar_label: getLaunchOptionsSync
---

Obtains the parameters upon Mini Program startup. The callback parameters are consistent with those of [`App.onLaunch`](https://developers.weixin.qq.com/miniprogram/en/dev/reference/api/App.html#onlaunchobject-object).

**NOTE**

In some versions, when there is no `referrerInfo`, the value `undefined` is returned. You can use `options.referrerInfo && options.referrerInfo.appId` to make a judgment.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html)

## Type

```tsx
() => LaunchOptionsApp
```

## Parameters

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getLaunchOptionsSync | ✔️ |  |  |
