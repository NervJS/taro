---
title: UpdateManager
sidebar_label: UpdateManager
---

The UpdateManager object, which is used to manage updates. Instances can be obtained via the `Taro.getUpdateManager` API.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/update/UpdateManager.html)

## Methods

### applyUpdate

Forces a Mini Program to restart and update to the latest version. This API is called after the new Mini Program version is downloaded (i.e., when the `onUpdateReady` callback is received).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/update/UpdateManager.applyUpdate.html)

```tsx
() => void
```

### onCheckForUpdate

Listens on the event that a request for checking for updates is sent to the WeChat backend. WeChat automatically checks for updates when the Mini program cold starts. The developer does not need to trigger this method.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/update/UpdateManager.onCheckForUpdate.html)

```tsx
(callback: OnCheckForUpdateCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnCheckForUpdateCallback</code></td>
      <td>The callback function for the event that a request for checking for updates is sent to the WeChat backend.</td>
    </tr>
  </tbody>
</table>

### onUpdateFailed

Listens on Mini Program update failure event. The app, instead of the developer, triggers the download when a newer version is available. A callback is performed when the download fails (probably due to network problems).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/update/UpdateManager.onUpdateFailed.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for Mini Program update failure event.</td>
    </tr>
  </tbody>
</table>

### onUpdateReady

Listens on the event that a newer Mini Program version is available. The app, instead of the developer, triggers the download. A callback is performed after successful download.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/update/UpdateManager.onUpdateReady.html)

```tsx
(callback: (res: CallbackResult) => void) => void
```

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the event that a newer Mini Program version is available.</td>
    </tr>
  </tbody>
</table>

## Parameter

### OnCheckForUpdateCallback

The callback function for the event that a request for checking for updates is sent to the WeChat backend.

```tsx
(result: OnCheckForUpdateResult) => void
```

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
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
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>hasUpdate</td>
      <td><code>boolean</code></td>
      <td>Indicates whether a new version is available</td>
    </tr>
  </tbody>
</table>
