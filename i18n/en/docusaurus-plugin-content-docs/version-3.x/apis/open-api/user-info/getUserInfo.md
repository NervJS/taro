---
title: Taro.getUserInfo(option)
sidebar_label: getUserInfo
---

Gets user information.

**API Adjustment Description**
If this API is called after user authorization is obtained, the user information is returned. If this API is called without user authorization, the authorization pop-up window will not appear, and the fail callback is directly executed. (For details, see [Announcement](https://developers.weixin.qq.com/community/develop/doc/0000a26e1aca6012e896a517556c01)).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/user-info/wx.getUserInfo.html)

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
      <td>withCredentials</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to include login status information. When withCredentials is true, <code>Taro.login</code> must be called previously and the login status must be effective. In this case, sensitive information such as encryptedData and iv is returned. When withCredentials is false, the login status is not required, and sensitive information such as encryptedData and iv is not returned.</td>
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
      <td><code>UserInfo</code></td>
      <td>User information object, excluding openid and other sensitive information.</td>
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
// It must be called after user authorization is obtained.
Taro.getUserInfo({
  success: function(res) {
    var userInfo = res.userInfo
    var nickName = userInfo.nickName
    var avatarUrl = userInfo.avatarUrl
    var gender = userInfo.gender // Gender: 0 - Unknown; 1 - Male; 2 - Female
    var province = userInfo.province
    var city = userInfo.city
    var country = userInfo.country
  }
})
```

There are two ways to get sensitive data. One is to use the [Decryption Algorithm for Encrypted Data](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#decryption-algorithm-for-encrypted-data). The acquired open data has the following json structure:

```json
{
  "openId": "OPENID",
  "nickName": "NICKNAME",
  "gender": GENDER,
  "city": "CITY",
  "province": "PROVINCE",
  "country": "COUNTRY",
  "avatarUrl": "AVATARURL",
  "unionId": "UNIONID",
  "watermark": {
    "appid":"APPID",
    "timestamp": TIMESTAMP
  }
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getUserInfo | ✔️ |  |  |
