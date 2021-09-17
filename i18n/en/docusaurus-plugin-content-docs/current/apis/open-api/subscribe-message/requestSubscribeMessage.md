---
title: Taro.requestSubscribeMessage(option)
sidebar_label: requestSubscribeMessage
---

Request a subscription message

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult | FailCallbackResult>
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
      <td>tmplIds</td>
      <td><code>any[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The set of ids of the message templates to subscribe to.</td>
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

### FailCallbackResult

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
      <td>errCode</td>
      <td><code>number</code></td>
      <td>Error code</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
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
      <td>[TEMPLATE_ID]</td>
      <td><code>&quot;accept&quot; | &quot;reject&quot; | &quot;ban&quot;</code></td>
      <td>Dynamic keys, i.e. template ids</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

#### Sample Code

Indicates that the user agrees to subscribe to the message zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE

```json
{
  "errMsg": "requestSubscribeMessage:ok",
  "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
}
```

### template_reflex

Template message subscription types

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>accept</td>
      <td>Indicates that the user agrees to subscribe to the template message corresponding to the id</td>
    </tr>
    <tr>
      <td>reject</td>
      <td>Indicates that the user refuses to subscribe to the template message corresponding to the id</td>
    </tr>
    <tr>
      <td>ban</td>
      <td>Indicates that the user has been blocked by the backend</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.requestSubscribeMessage({
  tmplIds: [''],
  success: function (res) { }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.requestSubscribeMessage | ✔️ |  |  |
