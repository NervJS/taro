---
title: Taro.onBLECharacteristicValueChange(callback)
sidebar_label: onBLECharacteristicValueChange
---

监听低功耗蓝牙设备的特征值变化事件。必须先启用 `notifyBLECharacteristicValueChange` 接口才能接收到设备推送的 notification。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLECharacteristicValueChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

低功耗蓝牙设备的特征值变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| characteristicId | `string` | 蓝牙特征值的 uuid |
| deviceId | `string` | 蓝牙设备 id |
| serviceId | `string` | 蓝牙特征值对应服务的 uuid |
| value | `ArrayBuffer` | 特征值最新的值 |

## 示例代码

```tsx
// ArrayBuffer转16进制字符串示例
function ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
Taro.onBLECharacteristicValueChange(function (res) {
  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
  console.log(ab2hex(res.value))
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBLECharacteristicValueChange | ✔️ |  |  |
