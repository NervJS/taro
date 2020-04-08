---
title: Taro.onHCEMessage(callback)
sidebar_label: onHCEMessage
id: version-2.1.1-onHCEMessage
original_id: onHCEMessage
---

监听接收 NFC 设备消息事件，仅能注册一个监听

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.onHCEMessage.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

接收 NFC 设备消息事件的回调函数

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
      <td>data</td>
      <td><code>ArrayBuffer</code></td>
      <td><code>messageType=1</code> 时 ,客户端接收到 NFC 设备的指令</td>
    </tr>
    <tr>
      <td>messageType</td>
      <td><code>1 | 2</code></td>
      <td>消息类型</td>
    </tr>
    <tr>
      <td>reason</td>
      <td><code>number</code></td>
      <td><code>messageType=2</code> 时，原因</td>
    </tr>
  </tbody>
</table>

### messageType

消息类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>HCE APDU Command类型，小程序需对此指令进行处理，并调用 sendHCEMessage 接口返回处理指令</td>
    </tr>
    <tr>
      <td>2</td>
      <td>设备离场事件类型</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onHCEMessage | ✔️ |  |  |
