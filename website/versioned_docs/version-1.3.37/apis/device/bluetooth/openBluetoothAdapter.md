---
title: Taro.openBluetoothAdapter(option)
sidebar_label: openBluetoothAdapter
id: version-1.3.37-openBluetoothAdapter
original_id: openBluetoothAdapter
---

初始化蓝牙模块

**注意**
- 其他蓝牙相关 API 必须在 Taro.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
- 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 Taro.openBluetoothAdapter 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.openBluetoothAdapter.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: BluetoothError) => void` | 否 | 接口调用成功的回调函数 |

### state

object.fail 回调函数返回的 state 参数（仅 iOS）

| 参数 | 说明 |
| --- | --- |
| 0 | 未知 |
| 1 | 重置中 |
| 2 | 不支持 |
| 3 | 未授权 |
| 4 | 未开启 |

## 示例代码

```tsx
Taro.openBluetoothAdapter({
  success: function (res) {
    console.log(res)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openBluetoothAdapter | ✔️ |  |  |
