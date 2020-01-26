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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(...args: any[]) => any` | 接收 NFC 设备消息事件的回调函数 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.offHCEMessage | ✔️ |  |  |  |  |  |  |  |
