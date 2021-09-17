---
title: Taro.onLocalServiceFound(callback)
sidebar_label: onLocalServiceFound
---

Listens on the mDNS service discovery event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/mdns/wx.onLocalServiceFound.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the mDNS service discovery event.

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
      <td>ip</td>
      <td><code>string</code></td>
      <td>Service IP address</td>
    </tr>
    <tr>
      <td>port</td>
      <td><code>number</code></td>
      <td>Service port</td>
    </tr>
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
| Taro.onLocalServiceFound | ✔️ |  |  |
