---
title: Taro.getWeRunData(option)
sidebar_label: getWeRunData
---

Gets the user's WeRun step counts for the past 30 days.You need to call the `Taro.login` API before calling this API.The step counts will update when the user opens the Mini Program.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html)

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

### SuccessCallback

```tsx
(result: SuccessCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>SuccessCallbackResult</code></td>
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
      <td>The Cloud ID corresponding to sensitive data. It is returned only in Mini Programs for which Cloud Base is enabled. The open data can be directly obtained via cloud call. See <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#method-cloud">details</a>.</td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>The complete encrypted user data, including sensitive data. For details, see <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html">Decryption Algorithm for Encrypted Data</a>.解密后得到的数据结构见后文</td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>The initial vector of the encryption algorithm. For details, see <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html">Decryption Algorithm for Encrypted Data</a>.</td>
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
Taro.getWeRunData({
  success: function (res) {
    // Decrypt the encryptedData in the developer's server to get open data. const encryptedData = res.encryptedData
    // Or directly get the open data via cloud call based on cloudID. const cloudID = res.cloudID
  }
})
```

**开放数据 JSON 结构** 敏感数据有两种获取方式，一是使用 [加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) 。 The acquired open data has the following json structure:

```json
{
  "stepInfoList": [
    {
      "timestamp": 1445866601,
      "step": 100
    },
    {
      "timestamp": 1445876601,
      "step": 120
    }
  ]
}
```

stepInfoList is composed as follows:

| Property  | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| timestamp | number | Timestamp, which is the data time |
| step      | number | WeRun step counts                 |

## API Support

|        API        | WeChat Mini-Program | H5 | React Native |
|:-----------------:|:-------------------:|:--:|:------------:|
| Taro.getWeRunData |         ✔️          |    |              |
