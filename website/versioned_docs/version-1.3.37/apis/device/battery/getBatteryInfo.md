---
title: Taro.getBatteryInfo(option)
sidebar_label: getBatteryInfo
id: version-1.3.37-getBatteryInfo
original_id: getBatteryInfo
---

获取设备电量。同步 API Taro.getBatteryInfoSync 在 iOS 上不可用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/battery/wx.getBatteryInfo.html)

## 类型

```tsx
(option?: Option) => void
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| isCharging | `boolean` | 是否正在充电中 |
| level | `string` | 设备电量，范围 1 - 100 |
| errMsg | `string` | 调用结果 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBatteryInfo | ✔️ |  |  |
