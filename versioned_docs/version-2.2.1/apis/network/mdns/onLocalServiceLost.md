---
title: Taro.onLocalServiceLost(callback)
sidebar_label: onLocalServiceLost
---

监听 mDNS 服务离开的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceLost.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

mDNS 服务离开的事件的回调函数

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
      <td>serviceName</td>
      <td><code>string</code></td>
      <td>服务的名称</td>
    </tr>
    <tr>
      <td>serviceType</td>
      <td><code>string</code></td>
      <td>服务的类型</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onLocalServiceLost | ✔️ |  |  |
