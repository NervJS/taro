---
title: Taro.onNetworkStatusChange(callback)
sidebar_label: onNetworkStatusChange
---

Listens on the network status change event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/network/wx.onNetworkStatusChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the network status change event.

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
      <td>isConnected</td>
      <td><code>boolean</code></td>
      <td>Indicates whether it is connected to the network</td>
    </tr>
    <tr>
      <td>networkType</td>
      <td><code>&quot;wifi&quot; | &quot;2g&quot; | &quot;3g&quot; | &quot;4g&quot; | &quot;unknown&quot; | &quot;none&quot;</code></td>
      <td>Network type</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onNetworkStatusChange(function (res) {
  console.log(res.isConnected)
  console.log(res.networkType)
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onNetworkStatusChange | ✔️ | ✔️ | ✔️ |
