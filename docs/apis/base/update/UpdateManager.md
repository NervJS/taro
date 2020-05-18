---
title: UpdateManager
sidebar_label: UpdateManager
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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnCheckForUpdateCallback</code></td>
      <td>向微信后台请求检查更新结果事件的回调函数</td>
    </tr>
  </tbody>
</table>

### onUpdateFailed

监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.onUpdateFailed.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>小程序更新失败事件的回调函数</td>
    </tr>
  </tbody>
</table>

### onUpdateReady

监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.onUpdateReady.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>小程序有版本更新事件的回调函数</td>
    </tr>
  </tbody>
</table>

## 参数

### OnCheckForUpdateCallback

向微信后台请求检查更新结果事件的回调函数

```tsx
(result: OnCheckForUpdateResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnCheckForUpdateResult</code></td>
    </tr>
  </tbody>
</table>

### OnCheckForUpdateResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>hasUpdate</td>
      <td><code>boolean</code></td>
      <td>是否有新版本</td>
    </tr>
  </tbody>
</table>
