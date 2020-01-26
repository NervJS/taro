---
title: Taro.getBatteryInfoSync()
sidebar_label: getBatteryInfoSync
---

Taro.getBatteryInfo 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/battery/wx.getBatteryInfoSync.html)

## 类型

```tsx
() => Result
```

## 参数

### Result

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| isCharging | `boolean` | 是否正在充电中 |
| level | `string` | 设备电量，范围 1 - 100 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getBatteryInfoSync | ✔️ |  |  |  |  |  |  |  |
