---
title: Taro.offLocalServiceFound(callback)
sidebar_label: offLocalServiceFound
id: version-1.3.37-offLocalServiceFound
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

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offLocalServiceFound | ✔️ |  |  |
