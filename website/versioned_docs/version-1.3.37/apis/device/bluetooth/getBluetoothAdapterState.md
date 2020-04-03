---
title: Taro.getBluetoothAdapterState(option)
sidebar_label: getBluetoothAdapterState
id: version-1.3.37-getBluetoothAdapterState
original_id: getBluetoothAdapterState
---

获取本机蓝牙适配器状态。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothAdapterState.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| available | `boolean` | 蓝牙适配器是否可用 |
| discovering | `boolean` | 是否正在搜索设备 |
| errMsg | `string` | 成功：ok，错误：详细信息 |

## 示例代码

```tsx
Taro.getBluetoothAdapterState({
  success: function (res) {
    console.log(res)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBluetoothAdapterState | ✔️ |  |  |
