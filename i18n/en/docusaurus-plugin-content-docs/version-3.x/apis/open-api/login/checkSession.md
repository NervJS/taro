---
title: Taro.checkSession(option)
sidebar_label: checkSession
---

Checks if the login status has expired.

A user login status obtained via the `Taro.login` API is time-sensitive. The Mini Program is more likely to expire when it is not used for a longer time. On the contrary, if the user keeps using the Mini Program, the user login status keeps effective. The specific time logic is maintained by WeChat and transparent to developers. Developers need only to call the `Taro.checkSession` API to check whether the current user login status has expired.

After a login status expired, developers can call the wx.login again to get the latest user login status. If the API is called successfully, the current session_key remains effective; if the call to the API failed, the session_key has expired. For more usages, see [Mini Program Login](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/login.html).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/login/wx.checkSession.html)

## Type

```tsx
(option?: Option) => Promise<CallbackResult>
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

## Sample Code

```tsx
Taro.checkSession({
  success: function () {
    //session_key has not expired and will remain effective for the current lifecycle.
  },
  fail: function () {
    // session_key has expired and the user needs to log in again.
    Taro.login() // Re-login
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.checkSession | ✔️ |  |  |
