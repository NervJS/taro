---
title: Taro.getWifiList(option)
sidebar_label: getWifiList
id: version-1.3.37-getWifiList
original_id: getWifiList
---

请求获取 Wi-Fi 列表。在 `onGetWifiList` 注册的回调中返回 `wifiList` 数据。 **Android 调用前需要 [用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.userLocation。**

iOS 将跳转到系统的 Wi-Fi 界面，Android 不会跳转。 iOS 11.0 及 iOS 11.1 两个版本因系统问题，该方法失效。但在 iOS 11.2 中已修复。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.getWifiList.html)

## 类型

```tsx
(option?: Option) => Promise<WifiError>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: WifiError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: WifiError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: WifiError) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getWifiList | ✔️ |  |  |
