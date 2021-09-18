---
title: Taro.onLocalServiceDiscoveryStop(callback)
sidebar_label: onLocalServiceDiscoveryStop
---

Listens on the mDNS service search stop event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/mdns/wx.onLocalServiceDiscoveryStop.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the event that the mDNS service search stops.

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
| Taro.onLocalServiceDiscoveryStop | ✔️ |  |  |
