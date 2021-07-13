---
title: Taro.chooseAddress(option)
sidebar_label: chooseAddress
---

Gets the recipient address. This API opens the native UI for the user to edit the recipient address and returns to the selected address after the editing is completed.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/address/wx.chooseAddress.html)

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
      <td>userName</td>
      <td><code>string</code></td>
      <td>Recipient name</td>
    </tr>
    <tr>
      <td>provinceName</td>
      <td><code>string</code></td>
      <td>Tier-1 address of national standard recipient address</td>
    </tr>
    <tr>
      <td>cityName</td>
      <td><code>string</code></td>
      <td>Tier-2 address of national standard recipient address</td>
    </tr>
    <tr>
      <td>countyName</td>
      <td><code>string</code></td>
      <td>Tier-3 address of national standard recipient address</td>
    </tr>
    <tr>
      <td>detailInfo</td>
      <td><code>string</code></td>
      <td>Detailed recipient address</td>
    </tr>
    <tr>
      <td>postalCode</td>
      <td><code>string</code></td>
      <td>Post code</td>
    </tr>
    <tr>
      <td>nationalCode</td>
      <td><code>string</code></td>
      <td>Country code of the recipient address</td>
    </tr>
    <tr>
      <td>telNumber</td>
      <td><code>string</code></td>
      <td>Mobile number of the recipient</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.chooseAddress({
  success: function (res) {
    console.log(res.userName)
    console.log(res.postalCode)
    console.log(res.provinceName)
    console.log(res.cityName)
    console.log(res.countyName)
    console.log(res.detailInfo)
    console.log(res.nationalCode)
    console.log(res.telNumber)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseAddress | ✔️ |  |  |
