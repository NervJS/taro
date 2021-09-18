---
title: Taro.sendHCEMessage(option)
sidebar_label: sendHCEMessage
---

Sends NFC messages. It only works in the Android system.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/nfc/wx.sendHCEMessage.html)

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
      <td>data</td>
      <td><code>ArrayBuffer</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Binary data</td>
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
const buffer = new ArrayBuffer(1)
const dataView = new DataView(buffer)
dataView.setUint8(0, 0)
      Taro.startHCE({
  success: function (res) {
    Taro.onHCEMessage(function (res) {
      if (res.messageType === 1) {
        Taro.sendHCEMessage({data: buffer})
      }
    })
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.sendHCEMessage | ✔️ |  |  |
