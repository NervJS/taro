---
title: Taro.onLocalServiceLost(callback)
sidebar_label: onLocalServiceLost
---

Listens on the mDNS service loss event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/mdns/wx.onLocalServiceLost.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the mDNS service loss event.

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
      <td>serviceName</td>
      <td><code>string</code></td>
      <td>Service name</td>
    </tr>
    <tr>
      <td>serviceType</td>
      <td><code>string</code></td>
      <td>Service type</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onLocalServiceLost | ✔️ |  |  |
