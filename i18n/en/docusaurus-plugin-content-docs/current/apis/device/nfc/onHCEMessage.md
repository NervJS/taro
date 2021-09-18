---
title: Taro.onHCEMessage(callback)
sidebar_label: onHCEMessage
---

Listens on the event of receiving NFC device messages.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/nfc/wx.onHCEMessage.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the event of receiving NFC device messages.

```tsx
(result: CallbackResult) => void
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
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

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
      <td>data</td>
      <td><code>ArrayBuffer</code></td>
      <td>When<code>messageType=1</code>, the app receives a command from the NFC device.</td>
    </tr>
    <tr>
      <td>messageType</td>
      <td><code>1 | 2</code></td>
      <td>Message type</td>
    </tr>
    <tr>
      <td>reason</td>
      <td><code>number</code></td>
      <td>The reason when<code>messageType=2</code>is returned</td>
    </tr>
  </tbody>
</table>

### messageType

Valid values of messageType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>HCE APDU Command type. The Mini Program needs to process this command and call the sendHCEMessage API to return the processed command.</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Device departure event type</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onHCEMessage | ✔️ |  |  |
