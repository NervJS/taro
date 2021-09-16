---
title: Taro.openSetting(option)
sidebar_label: openSetting
---

Opens the Mini Program settings interface on WeChat and returns setting results. **Only the [permissions](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/authorize.html) that have been requested by the Mini Program from the user are displayed on the settings interface**.

Note: As of the base library 2.3.0, only when the user taps at a specific location can the user be navigated to the settings page to manage authorization information. [Details](https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/setting/wx.openSetting.html)

## Type

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
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

### SuccessCallbackResult

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
      <td>authSetting</td>
      <td><code>AuthSetting</code></td>
      <td>Results of user authorization</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.openSetting({
  success: function (res) {
    console.log(res.authSetting)
    // res.authSetting = {
    //   "scope.userInfo": true,
    //   "scope.userLocation": true
    // }
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openSetting | ✔️ |  |  |
