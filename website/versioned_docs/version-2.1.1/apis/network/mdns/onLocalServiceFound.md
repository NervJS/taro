---
title: Taro.onLocalServiceFound(callback)
sidebar_label: onLocalServiceFound
id: version-2.1.1-onLocalServiceFound
original_id: onLocalServiceFound
---

监听 mDNS 服务发现的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.onLocalServiceFound.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

mDNS 服务发现的事件的回调函数

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
      <td>ip</td>
      <td><code>string</code></td>
      <td>服务的 ip 地址</td>
    </tr>
    <tr>
      <td>port</td>
      <td><code>number</code></td>
      <td>服务的端口</td>
    </tr>
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
| Taro.onLocalServiceFound | ✔️ |  |  |
