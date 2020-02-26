---
title: Taro.onBluetoothAdapterStateChange(callback)
sidebar_label: onBluetoothAdapterStateChange
---

监听蓝牙适配器状态变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

蓝牙适配器状态变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| available | `boolean` | 蓝牙适配器是否可用 |
| discovering | `boolean` | 蓝牙适配器是否处于搜索状态 |

## 示例代码

```tsx
Taro.onBluetoothAdapterStateChange(function (res) {
  console.log('adapterState changed, now is', res)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBluetoothAdapterStateChange | ✔️ |  |  |
