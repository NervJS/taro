---
title: Taro.startHCE(option)
sidebar_label: startHCE
---

Initializes the NFC module.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/nfc/wx.startHCE.html)

## Type

```tsx
(option: Option) => Promise<NFCError>
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
      <td>aid_list</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>List of AIDs to be registered in the system</td>
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

## Sample Code

```tsx
Taro.startHCE({
  aid_list: ['F222222222']
  success: function (res) {
    console.log(res.errMsg)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startHCE | ✔️ |  |  |
