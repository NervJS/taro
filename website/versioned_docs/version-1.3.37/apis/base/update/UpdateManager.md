---
title: UpdateManager
sidebar_label: UpdateManager
id: version-1.3.37-UpdateManager
original_id: UpdateManager
---

UpdateManager 对象，用来管理更新，可通过 Taro.getUpdateManager 接口获取实例。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.html)

## 方法

### applyUpdate

强制小程序重启并使用新版本。在小程序新版本下载完成后（即收到 `onUpdateReady` 回调）调用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.applyUpdate.html)

```tsx
() => void
```

### onCheckForUpdate

监听向微信后台请求检查更新结果事件。微信在小程序冷启动时自动检查更新，不需由开发者主动触发。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.onCheckForUpdate.html)

```tsx
(callback: OnCheckForUpdateCallback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `OnCheckForUpdateCallback` | 向微信后台请求检查更新结果事件的回调函数 |

### onUpdateFailed

监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.onUpdateFailed.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | 小程序更新失败事件的回调函数 |

### onUpdateReady

监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.onUpdateReady.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | 小程序有版本更新事件的回调函数 |

## 参数

### OnCheckForUpdateCallback

向微信后台请求检查更新结果事件的回调函数

```tsx
(result: OnCheckForUpdateResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnCheckForUpdateResult` |

### OnCheckForUpdateResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| hasUpdate | `boolean` | 是否有新版本 |
