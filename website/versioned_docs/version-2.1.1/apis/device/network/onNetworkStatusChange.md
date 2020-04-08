---
title: Taro.onNetworkStatusChange(callback)
sidebar_label: onNetworkStatusChange
id: version-2.1.1-onNetworkStatusChange
original_id: onNetworkStatusChange
---

监听网络状态变化。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.onNetworkStatusChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

网络状态变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>isConnected</td>
      <td><code>boolean</code></td>
      <td>当前是否有网络连接</td>
    </tr>
    <tr>
      <td>networkType</td>
      <td><code>&quot;wifi&quot; | &quot;2g&quot; | &quot;3g&quot; | &quot;4g&quot; | &quot;unknown&quot; | &quot;none&quot;</code></td>
      <td>网络类型</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.onNetworkStatusChange(function (res) {
  console.log(res.isConnected)
  console.log(res.networkType)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onNetworkStatusChange | ✔️ | ✔️ | ✔️ |
