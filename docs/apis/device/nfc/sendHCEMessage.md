---
title: Taro.sendHCEMessage(option)
sidebar_label: sendHCEMessage
---

发送 NFC 消息。仅在安卓系统下有效。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.sendHCEMessage.html)

## 类型

```tsx
(option: Option) => Promise<TaroGeneral.NFCError>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | `ArrayBuffer` | 是 | 二进制数据 |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

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
