---
title: Taro.chooseInvoice(option)
sidebar_label: chooseInvoice
---

Selects the user's existing invoices.

**Obtaining Information of Reimbursed Invoice Based on `cardId` and `encryptCode`**

See [Querying Information of Reimbursed Invoice] in [WeChat E-Invoice Documentation](https://developers.weixin.qq.com/doc/offiaccount/WeChat_Invoice/E_Invoice/Reimburser_API_List.html). For information on how to obtain `access_token`, see the [auth.getAccessToken](https://developers.weixin.qq.com/miniprogram/en/dev/api-backend/open-api/access-token/auth.getAccessToken.html) API documentation.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/invoice/wx.chooseInvoice.html)

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
      <td>invoiceInfo</td>
      <td><code>string</code></td>
      <td>The list of invoices selected by the user</td>
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
Taro.chooseInvoice({
  success: function (res) {}
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseInvoice | ✔️ |  |  |
