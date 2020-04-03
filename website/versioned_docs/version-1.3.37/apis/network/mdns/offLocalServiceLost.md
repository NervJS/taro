---
title: Taro.offLocalServiceLost(callback)
sidebar_label: offLocalServiceLost
id: version-1.3.37-offLocalServiceLost
original_id: offLocalServiceLost
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

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offLocalServiceLost | ✔️ |  |  |
