---
title: Taro.getBLEDeviceCharacteristics(option)
sidebar_label: getBLEDeviceCharacteristics
---

获取蓝牙设备某个服务中所有特征值(characteristic)。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceCharacteristics.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
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
      <td>deviceId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>蓝牙设备 id</td>
    </tr>
    <tr>
      <td>serviceId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>蓝牙服务 uuid，需要使用 <code>getBLEDeviceServices</code> 获取</td>
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
      <td><code>(res: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

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
      <td>characteristics</td>
      <td><code>BLECharacteristic[]</code></td>
      <td>设备特征值列表</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>成功：ok，错误：详细信息</td>
    </tr>
  </tbody>
</table>

### BLECharacteristic

设备特征值列表

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
      <td>properties</td>
      <td><code>Properties</code></td>
      <td>该特征值支持的操作类型</td>
    </tr>
    <tr>
      <td>uuid</td>
      <td><code>string</code></td>
      <td>蓝牙设备特征值的 uuid</td>
    </tr>
  </tbody>
</table>

### Properties

该特征值支持的操作类型

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
      <td>indicate</td>
      <td><code>boolean</code></td>
      <td>该特征值是否支持 indicate 操作</td>
    </tr>
    <tr>
      <td>notify</td>
      <td><code>boolean</code></td>
      <td>该特征值是否支持 notify 操作</td>
    </tr>
    <tr>
      <td>read</td>
      <td><code>boolean</code></td>
      <td>该特征值是否支持 read 操作</td>
    </tr>
    <tr>
      <td>write</td>
      <td><code>boolean</code></td>
      <td>该特征值是否支持 write 操作</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.getBLEDeviceCharacteristics({
  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
  deviceId,
  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
  serviceId,
  success: function (res) {
    console.log('device getBLEDeviceCharacteristics:', res.characteristics)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBLEDeviceCharacteristics | ✔️ |  |  |
