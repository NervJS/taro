---
title: Taro.offLocalServiceLost(callback)
sidebar_label: offLocalServiceLost
---

取消监听 mDNS 服务离开的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.offLocalServiceLost.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

mDNS 服务离开的事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.offLocalServiceLost | ✔️ |  |  |  |  |  |  |  |
