---
title: Taro.offLocalServiceFound(callback)
sidebar_label: offLocalServiceFound
id: version-2.1.1-offLocalServiceFound
original_id: offLocalServiceFound
---

取消监听 mDNS 服务发现的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.offLocalServiceFound.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

mDNS 服务发现的事件的回调函数

```tsx
(res: CallbackResult) => void
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
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offLocalServiceFound | ✔️ |  |  |
