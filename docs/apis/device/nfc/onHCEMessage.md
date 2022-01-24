---
title: Taro.onHCEMessage(callback)
sidebar_label: onHCEMessage
---

监听接收 NFC 设备消息事件，仅能注册一个监听

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.onHCEMessage.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `ArrayBuffer` | `messageType=1` 时 ,客户端接收到 NFC 设备的指令 |
| messageType | `keyof messageType` | 消息类型 |
| reason | `number` | `messageType=2` 时，原因 |

### messageType

消息类型

| 参数 | 说明 |
| --- | --- |
| 1 | HCE APDU Command类型，小程序需对此指令进行处理，并调用 sendHCEMessage 接口返回处理指令 |
| 2 | 设备离场事件类型 |
