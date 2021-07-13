---
title: Taro.requestPayment(option)
sidebar_label: requestPayment
---

Initiates a request for payment via WeChat Pay. For more information, see [WeChat Pay API Documentation](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_3&index=1).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/payment/wx.requestPayment.html)

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
      <td>nonceStr</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>A random string of less than 32 characters</td>
    </tr>
    <tr>
      <td>package</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The value of the prepay_id parameter returned by the unified order placement API, which should be submitted in the format of prepay_id=***.</td>
    </tr>
    <tr>
      <td>paySign</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Signature. For specific signature schemes, see <a href="https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&amp;index=3">Mini Program Pay API Documentation</a></td>
    </tr>
    <tr>
      <td>timeStamp</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Timestamp in seconds, from January 1st 1970 at 00:00:00 to the present time</td>
    </tr>
    <tr>
      <td>signType</td>
      <td><code>&quot;MD5&quot; | &quot;HMAC-SHA256&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>签名算法</td>
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

### signType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>MD5</td>
      <td>MD5</td>
    </tr>
    <tr>
      <td>HMAC-SHA256</td>
      <td>HMAC-SHA256</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.requestPayment({
  timeStamp: '',
  nonceStr: '',
  package: '',
  signType: 'MD5',
  paySign: '',
  success: function (res) { },
  fail: function (res) { }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.requestPayment | ✔️ | ✔️ |  |
