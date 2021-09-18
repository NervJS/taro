---
title: Taro.getUserProfile(option)
sidebar_label: getUserProfile
---

Gets information about the user. The authorization dialog pops up with each request and returns `userInfo` when the user agrees.

:::tip 
WeChat Foundation Library 2.10.4 started to support

Taro 2.2.17，3.0.29，3.1，3.2 already supported.
:::


> [WeChat adjustment background and instructions](https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801)

## getUserProfile

The user's personal information (avatar, nickname, gender and region) can be retrieved via the `Taro.getUserProfile` interface. This interface is supported by WeChat since version **2.10.4** of the base library and returns only the user's personal information, not the user identifier. The desc attribute of this interface (declaring what the user's personal information will be used for) will be displayed in a pop-up window later, so please fill in the form carefully.

Each time a developer obtains personal information from a user through this interface, user confirmation is required, so please keep the user's quickly filled in avatar nickname safe to avoid repeated pop-ups.

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
      <td>lang</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The language of the displayed user information</td>
    </tr>
    <tr>
      <td>desc</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>声明获取用户个人信息后的用途，不超过 30 个字符</td>
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
      <td>cloudID</td>
      <td><code>string</code></td>
      <td>The Cloud ID corresponding to sensitive data. It is returned only in Mini Programs for which <a href="https://developers.weixin.qq.com/miniprogram/en/dev/wxcloud/basis/getting-started.html">Cloud Base</a> is enabled. The open data can be directly obtained via cloud call. See <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#method-cloud">details</a>.</td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>The complete encrypted user data, including the sensitive data. For details, see <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#Encryption-Algorithm-for-Encrypted-Data">signature, verification, encryption, and decryption of user data</a>.</td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>The initial vector of the encryption algorithm. For details, see <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#Encryption-Algorithm-for-Encrypted-Data">signature, verification, encryption, and decryption of user data</a>.</td>
    </tr>
    <tr>
      <td>rawData</td>
      <td><code>string</code></td>
      <td>Raw data string that excludes sensitive information and is used to calculate signatures.</td>
    </tr>
    <tr>
      <td>signature</td>
      <td><code>string</code></td>
      <td>The string generated with SHA-1 (rawData + sessionkey), which is used to verify the user information. For details, see <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#Encryption-Algorithm-for-Encrypted-Data">signature, verification, encryption, and decryption of user data</a>.</td>
    </tr>
    <tr>
      <td>userInfo</td>
      <td> UserInfo </td>
      <td>User information object, excluding openid and other sensitive information.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getUserProfile({
  desc: 'For completing member profiles',
  success: (res) => {
    this.setState({
      userInfo: res.userInfo,
      hasUserInfo: true
    })
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getUserProfile | ✔️ |  |  |


## Other

issue : [Taro什么时候支持 getUserProfile 方法](https://github.com/NervJS/taro/issues/8810)