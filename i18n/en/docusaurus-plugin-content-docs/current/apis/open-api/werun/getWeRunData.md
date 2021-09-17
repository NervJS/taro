---
title: Taro.getWeRunData(option)
sidebar_label: getWeRunData
---

Gets the user's WeRun step counts for the past 30 days. You need to call the `Taro.login` API before calling this API. The step counts will update when the user opens the Mini Program.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/werun/wx.getWeRunData.html)

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
      <td>The complete encrypted user data, including sensitive data. For details, see <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html">Decryption Algorithm for Encrypted Data</a>. See below for the composition of the decrypted data.</td>
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
    // Decrypt the encryptedData in the developer's server to get open data.
    const encryptedData = res.encryptedData
    // Or directly get the open data via cloud call based on cloudID.
    const cloudID = res.cloudID
  }
})
```

**Open Data of JSON Structure**
There are two ways to get sensitive data. One is to use the [Decryption Algorithm for Encrypted Data](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#decryption-algorithm-for-encrypted-data). The acquired open data has the following json structure:

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

| Property | Type | Description |
| --- | ---- | --- |
| timestamp | number | Timestamp, which is the data time |
| step | number | WeRun step counts |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getWeRunData | ✔️ |  |  |
