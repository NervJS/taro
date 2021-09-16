---
title: Taro.offLocalServiceFound(callback)
sidebar_label: offLocalServiceFound
---

Un-listens on the mDNS service discovery event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/mdns/wx.offLocalServiceFound.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the mDNS service discovery event.

```tsx
(res: CallbackResult) => void
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
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offLocalServiceFound | ✔️ |  |  |
