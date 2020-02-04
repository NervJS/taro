---
title: Taro.sendHCEMessage(option)
sidebar_label: sendHCEMessage
---

发送 NFC 消息。仅在安卓系统下有效。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.sendHCEMessage.html)

## 类型

```tsx
(option: Option) => Promise<NFCError>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | `ArrayBuffer` | 是 | 二进制数据 |
| complete | `(res: NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: NFCError) => void` | 否 | 接口调用成功的回调函数 |

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
