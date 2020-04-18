---
title: Taro.readBLECharacteristicValue(option)
sidebar_label: readBLECharacteristicValue
---

读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用。

**注意**
- 并行调用多次会存在读失败的可能性。
- 接口读取到的信息需要在 `onBLECharacteristicValueChange` 方法注册的回调中获取。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.readBLECharacteristicValue.html)

## 类型

```tsx
(option: Option) => Promise<BluetoothError>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>characteristicId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>蓝牙特征值的 uuid</td>
    </tr>
    <tr>
      <td>deviceId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>蓝牙设备 id</td>
    </tr>
    <tr>
      <td>serviceId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>蓝牙特征值对应服务的 uuid</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
// 必须在这里的回调才能获取
Taro.onBLECharacteristicValueChange(function(characteristic) {
  console.log('characteristic value comed:', characteristic)
})
Taro.readBLECharacteristicValue({
  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
  deviceId,
  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
  serviceId,
  // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
  characteristicId,
  success: function (res) {
    console.log('readBLECharacteristicValue:', res.errCode)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.readBLECharacteristicValue | ✔️ |  |  |
