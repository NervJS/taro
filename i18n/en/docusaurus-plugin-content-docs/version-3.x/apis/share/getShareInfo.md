---
title: Taro.getShareInfo(option)
sidebar_label: getShareInfo
---

Gets forwarding details.

**Tips**
- To display the group name, use [open data components](https://developers.weixin.qq.com/miniprogram/en/dev/component/open-data.html).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/share/wx.getShareInfo.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult>
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
      <td>shareTicket</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>shareTicket</td>
    </tr>
    <tr>
      <td>timeout</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Timeout (in ms)</td>
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
      <td>The Cloud ID corresponding to sensitive data. It is returned only in Mini Programs for which Cloud Base is enabled. The open data can be directly obtained via cloud call. See <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#method-cloud">Detail</a>.</td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>The complete encrypted forwarding data, including sensitive data. For details, see<a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html">Decryption Algorithm for Encrypted Data</a></td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>The initial vector of the encryption algorithm. For details, see <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html">Decryption Algorithm for Encrypted Data</a></td>
    </tr>
  </tbody>
</table>

## Sample Code

There are two ways to get sensitive data. One is to use the [Decryption Algorithm for Encrypted Data](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/signature.html#decryption-algorithm-for-encrypted-data). The acquired open data has the following json structure (in which, openGId is the unique identifier of the current group):

```json
{
 "openGId": "OPENGID"
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getShareInfo | ✔️ |  |  |
