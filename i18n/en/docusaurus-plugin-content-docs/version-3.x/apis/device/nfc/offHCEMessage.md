---
title: Taro.offHCEMessage(callback)
sidebar_label: offHCEMessage
---

Un-listens on the event of receiving NFC device messages.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/nfc/wx.offHCEMessage.html)

## Type

```tsx
(callback: (...args: any[]) => any) => void
```

## Parameters

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
      <td>callback</td>
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td>The callback function for the event of receiving NFC device messages.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offHCEMessage | ✔️ |  |  |
