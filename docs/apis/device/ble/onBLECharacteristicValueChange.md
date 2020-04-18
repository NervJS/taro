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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>characteristicId</td>
      <td><code>string</code></td>
      <td>蓝牙特征值的 uuid</td>
    </tr>
    <tr>
      <td>deviceId</td>
      <td><code>string</code></td>
      <td>蓝牙设备 id</td>
    </tr>
    <tr>
      <td>serviceId</td>
      <td><code>string</code></td>
      <td>蓝牙特征值对应服务的 uuid</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>ArrayBuffer</code></td>
      <td>特征值最新的值</td>
    </tr>
  </tbody>
</table>

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
