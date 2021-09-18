---
title: Taro.authorize(option)
sidebar_label: authorize
---

Initiates an authorization request to the user in advance. After this API is called, a pop-up box appears to ask whether the user agrees to authorize the Mini Program to use a specific feature or obtain certain data of the user, but the appropriate APIs are not actually called. If the user has already given the authorization, the pop-up box will not appear, and a message indicating success is returned directly. For more usages, see [User Authorization](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/authorize.html).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/authorize/wx.authorize.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scope</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The scope to be authorized. For details, see <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/authorize.html#scope-list">scope list</a></td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
// Use Taro.getSetting to query whether the user has authorized the "scope.record".
Taro.getSetting({
  success: function (res) {
    if (!res.authSetting['scope.record']) {
      Taro.authorize({
        scope: 'scope.record',
        success: function () {
          // The user has allowed the Mini Program to use the recording feature. When the Taro.startRecord API is called later, the pop-up box will not appear.
          Taro.startRecord()
        }
      })
    }
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.authorize | ✔️ |  |  |
