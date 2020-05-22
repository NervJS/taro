---
title: Taro.sendHCEMessage(option)
sidebar_label: sendHCEMessage
id: version-2.1.1-sendHCEMessage
original_id: sendHCEMessage
---

发送 NFC 消息。仅在安卓系统下有效。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.sendHCEMessage.html)

## 类型

```tsx
(option: Option) => Promise<NFCError>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>ArrayBuffer</code></td>
      <td style="text-align:center">是</td>
      <td>二进制数据</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: NFCError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: NFCError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: NFCError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const buffer = new ArrayBuffer(1)
const dataView = new DataView(buffer)
dataView.setUint8(0, 0)
      Taro.startHCE({
  success: function (res) {
    Taro.onHCEMessage(function (res) {
      if (res.messageType === 1) {
        Taro.sendHCEMessage({data: buffer})
      }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.sendHCEMessage | ✔️ |  |  |
