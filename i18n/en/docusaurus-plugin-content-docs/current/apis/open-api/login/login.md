---
title: Taro.login(option)
sidebar_label: login
---

Gets the login credential (code), which is then used to exchange for the user login status information, including the unique identifier (openid) of the user and the session key (session_key) of the current login. The communication for user data encryption and decryption is performed using the session key. For more usages, see [Mini Program Login](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/login.html).


> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/login/wx.login.html)

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
      <td>timeout</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Timeout time in ms</td>
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
      <td>code</td>
      <td><code>string</code></td>
      <td>The user login credential, which is valid for five minutes. The developer needs to call <a href="https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html">auth.code2Session</a> in the developer server backend, and exchange the code for information such as the openid and session_key.</td>
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
Taro.login({
  success: function (res) {
    if (res.code) {
      // Send a network request
      Taro.request({
        url: 'https://test.com/onLogin',
        data: {
          code: res.code
        }
      })
    } else {
      console.log('Login failed' + res.errMsg)
    }
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.login | ✔️ |  |  |
