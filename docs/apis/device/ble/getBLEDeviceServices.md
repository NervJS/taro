---
title: Taro.getBLEDeviceServices(option)
sidebar_label: getBLEDeviceServices
---

获取蓝牙设备所有服务(service)。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceServices.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| deviceId | `string` | 是 | 蓝牙设备 id |
| complete | `(res: BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| services | `BLEService[]` | 设备服务列表 |
| errMsg | `string` | 成功：ok，错误：详细信息 |

### BLEService

设备服务列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| isPrimary | `boolean` | 该服务是否为主服务 |
| uuid | `string` | 蓝牙设备服务的 uuid |

## 示例代码

```tsx
Taro.getBLEDeviceServices({
  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
  deviceId,
  success: function (res) {
    console.log('device services:', res.services)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBLEDeviceServices | ✔️ |  |  |
