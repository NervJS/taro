---
title: Taro.getUpdateManager()
sidebar_label: getUpdateManager
---
Obtains the **globally unique** version update manager, which is used to manage Mini Program updates. For more information about the Mini Program update mechanism, see the [Operating Mechanism](https://developers.weixin.qq.com/miniprogram/en/dev/framework/runtime/operating-mechanism.html) documentation.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/update/wx.getUpdateManager.html)

## Type

```tsx
() => UpdateManager
```

## Parameters

## Sample Code

```tsx
const updateManager = Taro.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
  console.log(res.hasUpdate)
})
updateManager.onUpdateReady(function () {
  Taro.showModal({
    title: 'Update Tips',
    content: 'The new version is ready, is the app restarted?',
    success: function (res) {
      if (res.confirm) {
        // The new version has been downloaded, call applyUpdate to apply the new version and restart.
        updateManager.applyUpdate()
      }
    }
  })
})
updateManager.onUpdateFailed(function () {
  // Download of the new version has failed
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getUpdateManager | ✔️ |  |  |
