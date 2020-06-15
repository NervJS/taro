---
title: Taro.getUpdateManager()
sidebar_label: getUpdateManager
---

获取**全局唯一**的版本更新管理器，用于管理小程序更新。
关于小程序的更新机制，可以查看[运行机制](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html)文档。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/wx.getUpdateManager.html)

## 类型

```tsx
() => UpdateManager
```

## 参数

## 示例代码

```tsx
const updateManager = Taro.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
})
updateManager.onUpdateReady(function () {
  Taro.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success: function (res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})
updateManager.onUpdateFailed(function () {
  // 新的版本下载失败
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getUpdateManager | ✔️ |  |  |
