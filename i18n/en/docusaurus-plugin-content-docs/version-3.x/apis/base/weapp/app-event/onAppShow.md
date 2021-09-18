---
title: Taro.onAppShow(callback)
sidebar_label: onAppShow
---

Listens on the event that Mini Program is switched to foreground. The callback timing for this event is consistent with that of [`App.onShow`](https://developers.weixin.qq.com/miniprogram/en/dev/reference/api/App.html#onshowobject-object).

**Scenes that Return Valid referrerInfo**

| Scene Value | Scene | Meaning of appId |
| ------ | ------------------------------- | ---------- |
| 1020   | Related Mini Program list in the profile page of an Official Account | Source Official Account |
| 1035   | Custom menu of an Official Account | Source Official Account |
| 1036   | Message card shared from an app | Source app |
| 1037   | Mini Program opened from a Mini Program | Source Mini Program |
| 1038   | Returned from another Mini Program | Source Mini Program |
| 1043   | Template message of an Official Account | Source Official Account |

**Note**

In some versions, when there is no `referrerInfo`, the value `undefined` is returned. You can use `options.referrerInfo && options.referrerInfo.appId` to make a judgment.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.onAppShow.html)

## Type

```tsx
(callback: (result: CallbackResult) => void) => void
```

## Parameters

### CallbackResult

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
      <td>path</td>
      <td><code>string</code></td>
      <td>The path for switching the Mini Program to foreground</td>
    </tr>
    <tr>
      <td>query</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The query parameter for switching the Mini Program to foreground</td>
    </tr>
    <tr>
      <td>referrerInfo</td>
      <td><code>ResultReferrerInfo</code></td>
      <td>The source information. This is returned when a user enters the Mini Program from another Mini Program, Official Account, or app. Otherwise, {} is returned. (see the Note below for details.)</td>
    </tr>
    <tr>
      <td>scene</td>
      <td><code>number</code></td>
      <td>The<a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/app-service/scene.html">scene value</a>for switching the Mini Program to foreground</td>
    </tr>
    <tr>
      <td>shareTicket</td>
      <td><code>string</code></td>
      <td>The shareTicket. See <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/share.html">Obtaining More Forwarded Information</a> for details.</td>
    </tr>
  </tbody>
</table>

### ResultReferrerInfo

The source information. This is returned when a user enters the Mini Program from another Mini Program, Official Account, or app. Otherwise, {} is returned. (see the Note below for details.)

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
      <td>appId</td>
      <td><code>string</code></td>
      <td>The appId of the source Mini Program, Official Account, or app.</td>
    </tr>
    <tr>
      <td>extraData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The data transfered from the source Mini Program, supported when scene=1037 or 1038.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onAppShow | ✔️ |  |  |
