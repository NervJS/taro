---
title: Taro.offHCEMessage(callback)
sidebar_label: offHCEMessage
---

接收 NFC 设备消息事件，取消事件监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.offHCEMessage.html)

## 类型

```tsx
(callback: (...args: any[]) => any) => void
```

## 参数

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
      <td>callback</td>
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td>接收 NFC 设备消息事件的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offHCEMessage | ✔️ |  |  |
