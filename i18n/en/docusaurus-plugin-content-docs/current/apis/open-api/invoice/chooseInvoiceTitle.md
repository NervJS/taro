---
title: Taro.chooseInvoiceTitle(option)
sidebar_label: chooseInvoiceTitle
---

Selects the user's invoice title. This API can be called only when the current Mini Program is associated with an Official Account that has completed [WeChat verification](https://developers.weixin.qq.com/doc/offiaccount/WeChat_Invoice/Quick_issuing/Access_Request.html).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html)

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
      <td>title</td>
      <td><code>string</code></td>
      <td>Title name</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>0 | 1</code></td>
      <td>Title type</td>
    </tr>
    <tr>
      <td>taxNumber</td>
      <td><code>string</code></td>
      <td>Tax number</td>
    </tr>
    <tr>
      <td>companyAddress</td>
      <td><code>string</code></td>
      <td>Company address</td>
    </tr>
    <tr>
      <td>telephone</td>
      <td><code>string</code></td>
      <td>Mobile number</td>
    </tr>
    <tr>
      <td>bankName</td>
      <td><code>string</code></td>
      <td>Bank name</td>
    </tr>
    <tr>
      <td>bankAccount</td>
      <td><code>string</code></td>
      <td>Bank account</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
  </tbody>
</table>

### invoice_type

invoice type

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td><code>&quot;Company&quot;</code></td>
    </tr>
    <tr>
      <td>1</td>
      <td><code>&quot;Individual&quot;</code></td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.chooseInvoiceTitle({
  success: function(res) {}
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseInvoiceTitle | ✔️ |  |  |
