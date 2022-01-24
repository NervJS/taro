---
title: Taro.onGetWifiList(callback)
sidebar_label: onGetWifiList
---

监听获取到 Wi-Fi 列表数据事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onGetWifiList.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| wifiList | `WifiInfo[]` | Wi-Fi 列表数据 |
